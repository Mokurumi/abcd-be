const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { catchAsync } = require("../utils/catchAsync");
const { generateOTP, generateTempPassword } = require("../utils");
const { Role } = require("../models");
// const sendSMS = require("../config/sendSMS");
const {
  authService,
  userService,
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

  const defaultRole = await Role.findOne({ value: "user" });

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
  await authService.logout(req.body.token);
  res.status(httpStatus.ACCEPTED).send({
    message: "Logout successfully.",
  });
});

/**
 * Refresh token
 */
const refreshToken = catchAsync(async (req, res) => {
  const { token } = req.body;
  // get auth token from the request authorization header
  const authHeader = req.headers.authorization;
  const authToken = authHeader.split(" ")[1];
  const tokens = await authService.refreshAuth(token, authToken);
  res.send({ tokens });
});

module.exports = {
  register,
  verifyRegistration,
  resendRegistrationEmail,
  login,
  logout,
  refreshToken,
  // forgotPassword,
  // resetPassword,
  // sendVerificationEmail,
  // verifyEmail,
  // accountSetup,
  // requestOTP,
  // verifyRegisterToken,
  // verifyResetPasswordToken
};
