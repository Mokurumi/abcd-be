import ApiError from "../utils/ApiError";
import catchAsync from "../utils/catchAsync";
import { formatPhoneNumber, generateTempPassword } from "../utils";
import {
  authService,
  userService,
  roleService,
  tokenService,
  emailService,
} from "../services";
// import sendSMS from "../config/sendSMS";
import { tokenTypes } from "../constants";

/**
 * Register a new user
 * @param {*} req
 * @param {*} res
 */
const register = catchAsync(async (req, res) => {
  const defaultRole = await roleService.getRoleByValue("user");
  if (!defaultRole) {
    throw new ApiError(500, "Default role not found");
  }

  // Create user account
  const user = await userService.createUser({
    ...req.body,
    role: defaultRole._id,
  });

  // Generate registration token for email
  const registrationToken = await tokenService.generateRegistrationToken(user);

  // Send user one time registration email to set up their account credentials
  await emailService.sendRegistrationEmail(user, registrationToken || "");

  // response
  res.status(201).send({
    message:
      "Registration successful. Please check your email for activation link.",
  });
});

/**
 * Verify email registration
 * @param {*} req
 * @param {*} res
 */
const verifyRegistration = catchAsync(async (req, res) => {
  const { token, userId } = req.body;
  const user = await authService.verifyRegistrationToken(token, userId);

  if (!user) {
    throw new ApiError(401, "Invalid token");
  }
  res.status(200).send({
    message: "Email verified successfully. Please login to continue.",
  });
});

/**
 * Resend registration email
 * @param {*} req
 * @param {*} res
 */
const resendRegistrationEmail = catchAsync(async (req, res) => {
  const { userId } = req.body;
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // if the user is already active and email verified
  if (user.active && user.isEmailVerified) {
    throw new ApiError(
      400,
      "Your account is already active. Please login to continue."
    );
  }

  // Generate registration token for email
  const registrationToken = await tokenService.generateRegistrationToken(user);

  // Send user one time registration email to set up their account credentials
  await emailService.sendRegistrationEmail(user, registrationToken || "");

  res.status(200).send({
    message: "Email sent successfully.",
  });
});

/**
 * Login
 */
const login = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  const user = await authService.loginUser(username, password);
  const tokens = await tokenService.generateAuthTokens(user?._id?.toString());
  res.send({ user, tokens });
});

/**
 * Logout
 */
const logout = catchAsync(async (req, res) => {
  res.status(202).send({
    message: "Logout successful.",
  });

  try {
    const { token } = req.body;

    const refreshTokenDoc = await tokenService.verifyToken(
      token,
      tokenTypes.REFRESH,
      (req.user as any)?._id
    );
    if (!refreshTokenDoc) {
      throw new ApiError(401, "Invalid token");
    }

    await tokenService.deleteToken(refreshTokenDoc.token, tokenTypes.REFRESH);
  } catch (err) {
    console.log(err);
  }
});

/**
 * Refresh token
 */
const refreshToken = catchAsync(async (req, res) => {
  const { token } = req.body;
  const tokens = await authService.refreshAuth(token, req.user as any);
  res.send({ tokens });
});

/**
 * Reset password
 */
const resetPassword = catchAsync(async (req, res) => {
  const { emailAddress, phoneNumber } = req.body;
  const user = await userService.getUserByPhoneNumberOrEmail(
    emailAddress || formatPhoneNumber(phoneNumber)
  );
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Generate temporary password
  const tempPassword = generateTempPassword();
  await userService.updateUserById(user._id as any, {
    password: tempPassword,
    firstTimeLogin: true,
  });

  // Send user reset password email
  await emailService.sendTemporaryPasswordEmail(user, tempPassword);

  res.status(200).send({
    message: "Temporary password sent successfully. Please check your email.",
  });
});

/**
 * Change password
 */
const changePassword = catchAsync(async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!(await user.isPasswordMatch(currentPassword))) {
    throw new ApiError(401, "Incorrect password");
  }

  await userService.updateUserById(userId, {
    password: newPassword,
    firstTimeLogin: false,
  });

  authService.logoutAllInstances(userId);

  res.status(200).send({
    message: "Password changed successfully.",
  });
});

/**
 * Get user profile
 */
const getUserProfile = catchAsync(async (req, res) => {
  const user = req.user;
  res.send(user);
});

/**
 * Update user profile
 */
const updateUserProfile = catchAsync(async (req, res) => {
  const updatedUser = await userService.updateUserById(
    (req.user as any)?._id,
    req.body
  );
  res.send({
    message: "Profile updated successfully.",
    user: {
      ...updatedUser.toJSON(),
      role: (req.user as any)?.role,
    },
  });
});

/**
 * Delete user profile
 */
const deleteUserProfile = catchAsync(async (req, res) => {
  // generate delete profile token
  const deleteProfileToken = await tokenService.generateDeleteProfileToken(
    req.user as any
  );

  // send user delete profile email
  await emailService.sendDeleteProfileEmail(
    req.user as any,
    deleteProfileToken || ""
  );

  res.status(200).send({
    message: "Delete Request Received. Check your email for confirmation.",
  });
});

/**
 * Verify delete profile
 */
const verifyDeleteProfile = catchAsync(async (req, res) => {
  const { token, userId } = req.body;
  const user = await authService.verifyDeleteProfileToken(token, userId);

  if (!user) {
    throw new ApiError(401, "Invalid link");
  }

  await userService.deleteUserById(userId);

  res.status(200).send({
    message: "Profile deleted successfully.",
  });
});

export default {
  register,
  verifyRegistration,
  resendRegistrationEmail,
  login,
  logout,
  refreshToken,
  resetPassword,
  changePassword,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  verifyDeleteProfile,
};
