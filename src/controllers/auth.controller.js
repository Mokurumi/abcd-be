const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { catchAsync } = require("../utils/catchAsync");
const { generateOTP, generateTempPassword } = require("../utils");
// const sendSMS = require("../config/sendSMS");
const {
  authService,
  userService,
  roleService,
  tokenService,
  emailService,
  // notificationServicec
} = require("../services");

/**
 * Register a new user
 * @param {*} req
 * @param {*} res
 */
const register = catchAsync(async (req, res) => {

  const defaultRole = await roleService.getRoleByValue("user");
  if (!defaultRole) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Default role not found");
  }

  // Create user account
  const user = await userService.createUser({
    ...req.body,
    role: defaultRole._id,
  });

  // Generate registration token for email
  const registrationToken = await tokenService.generateRegistrationToken(user);

  // Send user one time registration email to set up their account credentials
  await emailService.sendRegistrationEmail(user, registrationToken);

  // // Create notification
  // await notificationService.createNotification({
  //   userId: user._id,
  //   title: `Registration complete`,
  //   message: "Congratulations! Welcome to ABCD Think Tank.",
  // });

  // response
  // res.status(httpStatus.CREATED).send(user);
  res.status(httpStatus.CREATED).send({
    message: "Registration successful. Please check your email for activation link.",
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
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid token");
  }
  res.status(httpStatus.OK).send({
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
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // if the user is already active and email verified
  if (user.active && user.isEmailVerified) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Your account is already active. Please login to continue.");
  }

  // Generate registration token for email
  const registrationToken = await tokenService.generateRegistrationToken(user);

  // Send user one time registration email to set up their account credentials
  await emailService.sendRegistrationEmail(user, registrationToken);

  res.status(httpStatus.OK).send({
    message: "Email sent successfully. Please check your email for registration link.",
  });
});

/**
 * Login
 */
const login = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  const user = await authService.loginUser(username, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

/**
 * Logout
 */
const logout = catchAsync(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  await authService.logout(token);
  res.status(httpStatus.ACCEPTED).send({
    message: "Logout successfully.",
  });
});

/**
 * Refresh token
 */
const refreshToken = catchAsync(async (req, res) => {
  const { token } = req.body;
  const user = req.user;
  const tokens = await authService.refreshAuth(token, user);
  res.send({ tokens });
});

/**
 * Reset password
 */
const resetPassword = catchAsync(async (req, res) => {
  const { emailAddress, phoneNumber } = req.body;
  const user = await userService.getUserByPhoneNumberOrEmail(emailAddress || phoneNumber);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Generate reset password token
  const resetPasswordToken = await tokenService.generateResetPasswordToken(user.emailAddress);

  // Send user reset password email
  await emailService.sendResetPasswordEmail(user, resetPasswordToken);

  res.status(httpStatus.OK).send({
    message: "Reset password link sent successfully. Please check your email.",
  });
});

/**
 * Verify reset password
 */
const verifyResetPassword = catchAsync(async (req, res) => {
  const { token, userId } = req.body;
  const user = await authService.verifyResetPasswordToken(token, userId);

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid link");
  }

  // Generate temporary password
  const tempPassword = generateTempPassword();
  await userService.updateUserById(userId, {
    password: tempPassword,
    firstTimeLogin: true,
  });

  // Send user temporary password email
  await emailService.sendTemporaryPasswordEmail(user, tempPassword);

  res.status(httpStatus.OK).send({
    message: "Verification successful. Check email for temporary password.",
  });
});

/**
 * Change password
 */
const changePassword = catchAsync(async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!(await user.isPasswordMatch(currentPassword))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect password");
  }

  await userService.updateUserById(userId, {
    password: newPassword,
    firstTimeLogin: false,
  });

  authService.logoutAllInstances(userId);

  res.status(httpStatus.OK).send({
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
  const user = req.user;
  const updatedUser = await userService.updateUserById(user._id, req.body);
  res.send({
    message: "Profile updated successfully.",
    user: {
      ...updatedUser.toJSON(),
      role: user.role,
    }
  });
});

/**
 * Delete user profile
 */
const deleteUserProfile = catchAsync(async (req, res) => {
  const user = req.user;

  // generate delete profile token
  const deleteProfileToken = await tokenService.generateDeleteProfileToken(user);

  // send user delete profile email
  await emailService.sendDeleteProfileEmail(user, deleteProfileToken);

  res.status(httpStatus.OK).send({
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
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid link");
  }

  await userService.deleteUserById(userId);

  res.status(httpStatus.OK).send({
    message: "Profile deleted successfully.",
  });
});


module.exports = {
  register,
  verifyRegistration,
  resendRegistrationEmail,
  login,
  logout,
  refreshToken,
  resetPassword,
  verifyResetPassword,
  changePassword,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  verifyDeleteProfile
};
