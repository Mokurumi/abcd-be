const httpStatus = require("http-status");
const { isEmpty } = require("lodash");
const Token = require("../models/Token");
const tokenService = require("./token.service");
const userService = require("./user.service");
const emailService = require("./email.service");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/tokens");


/**
 * Verify registration token
 * @param {string} token
 * @param {string} userId
 * @returns {Promise}
 */
const verifyRegistrationToken = async (token, userId) => {
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  const isValid = await tokenService.verifyToken(token, tokenTypes.VERIFY_REGISTRATION, user);
  if (!isValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid token");
  }
  user.isEmailVerified = true;
  user.active = true;
  await user.save();
  return user;
};

/**
 * Login with username and password
 * @param {string} username
 * @param {string} password
 * @returns {Promise}
 */
const loginUser = async (username, password) => {
  // User data
  const user = await userService.getUserByPhoneNumberOrEmail(username);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Incorrect username or password");
  }

  let failedLogin = false;

  // Existing users (imported users) and they have no password
  if (user && isEmpty(user.password)) {
    // Generate registration token for email
    const registrationToken = await tokenService.generateRegistrationToken(user);

    // Send user one time registration email to set up their account credentials
    await emailService.sendRegistrationEmail(user, registrationToken);

    failedLogin = true;
    throw new ApiError(httpStatus.FOUND, "Check your email for an activation link to set up your account");
  }

  // Account not active
  if (!user.active && !user.isEmailVerified) {
    failedLogin = true;
    throw new ApiError(httpStatus.UNAUTHORIZED, "Your account is not yet active. Please check your email for activation link.");
  }

  // Email or password incorrect
  if (!user || !(await user.isPasswordMatch(password))) {
    failedLogin = true;
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect username or password");
  }

  // Account is disabled
  if (!user.active && !!user.isEmailVerified) {
    failedLogin = true;
    throw new ApiError(httpStatus.UNAUTHORIZED, "Your account is disabled. Kindly contact support.");
  }

  // update lastLogin date
  if (failedLogin) {
    user.lastFailedLogin = Date.now();
  }
  else {
    user.lastLogin = Date.now();
  }
  await user.save();

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
 * Logout all instances
 * @param {string} userId
 * @returns {Promise}
 */
const logoutAllInstances = async (userId) => {
  await Token.deleteMany({
    user: userId,
    type: tokenTypes.REFRESH,
  });
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken, authToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyRefreshToken(refreshToken, authToken);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    // await refreshTokenDoc.remove();
    await tokenService.deleteToken(refreshTokenDoc.token, tokenTypes.REFRESH);
    return tokenService.generateAuthTokens(user);
  }
  catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid token");
  }
};

/**
 * Verify reset password token
 * @param {string} token
 * @param {string} userId
 * @returns {Promise}
 */
const verifyResetPasswordToken = async (token, userId) => {
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  const isValid = await tokenService.verifyToken(token, tokenTypes.RESET_PASSWORD, user);
  if (!isValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid token");
  }
  return user;
};


module.exports = {
  verifyRegistrationToken,
  loginUser,
  logout,
  logoutAllInstances,
  refreshAuth,
  verifyResetPasswordToken,
  // resetPassword,
  // verifyEmail,
};
