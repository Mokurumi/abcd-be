const httpStatus = require("http-status");
const { isEmpty } = require("lodash");
const Token = require("../models/Token");
const tokenService = require("./token.service");
const userService = require("./user.service");
const emailService = require("./email.service");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/tokens");

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  // User data
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "There is no existing account with information provided. Please register to use the platform.");
  }

  // Existing users (imported users) and they have no password
  if (user && isEmpty(user.password)) {
    // Generate registration token for email
    const registrationToken = await tokenService.generateRegisterEmailToken(user);

    // Send user one time registration email to set up their account credentials
    await emailService.sendRegistrationEmail(user, registrationToken);

    throw new ApiError(httpStatus.FOUND, "Check your email for an activation link to set up your account credentials");
  }

  // Email or password incorrect
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }

  // Account not active
  if (user.status === "Disabled" && !user.isEmailVerified) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Your account is not yet active. Please check your email for activation link.");
  }

  // Account is disabled
  if (user.status === "Disabled" && !!user.isEmailVerified) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Your account has been disabled. Kindly contact cvstudio for support.");
  }

  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });

    return user;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password reset failed. Please contact cvstudio admin for further assistance.");
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(
      verifyEmailToken,
      tokenTypes.VERIFY_EMAIL
    );
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }

    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
    return user;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Email verification failed");
  }
};

/**
 * Verify registration on the web
 * @param {string} verifyRegistration
 * @returns {Promise}
 */
const verifyRegistration = async (verifyRegistrationToken) => {
  try {
    const verifyRegistrationTokenDoc = await tokenService.verifyToken(
      verifyRegistrationToken,
      tokenTypes.VERIFY_REGISTRATION
    );

    const user = await userService.getUserById(verifyRegistrationTokenDoc.user);
    await Token.deleteMany({
      user: user.id,
      type: tokenTypes.VERIFY_REGISTRATION,
    });
    return user;
  } catch (error) {
    throw new Error();
  }
};

/**
 * Verify registration token
 * @param {string} token
 * @returns {Promise<Object>}
 */
const verifyRegistrationToken = async (token) => {
  try {
    const registrationTokenDoc = await tokenService.verifyToken(token, tokenTypes.VERIFY_REGISTRATION);
    return registrationTokenDoc;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Your registration token has expired. Please contact your company administrator for support.");
  }
};

/**
 * Verify reset password token
 * @param {string} token
 * @returns {Promise<Object>}
 */
const verifyResetPasswordToken = async (token) => {
  try {
    const resetTokenDoc = await tokenService.verifyToken(token, tokenTypes.RESET_PASSWORD);
    return resetTokenDoc;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Your reset credentials token has expired. Please contact your company administrator for support.");
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
  verifyRegistration,
  verifyRegistrationToken,
  verifyResetPasswordToken,
};
