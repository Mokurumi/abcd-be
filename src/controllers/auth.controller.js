const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { catchAsync } = require("../utils/catchAsync");
const { generateOTP } = require("../utils");
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
 */
const register = catchAsync(async (req, res) => {

  const defaultRole = await Role.findOne({ value: "user" });

  // Create user account
  const user = await userService.createUser({
    ...req.body,
    role: defaultRole._id,
  });

  // Generate registration token for email
  const registrationToken = await tokenService.generateRegisterEmailToken(user);

  // Send user one time registration email to set up their account credentials
  await emailService.sendRegistrationEmail(user, registrationToken);

  // // Create notification
  // await notificationService.createNotification({
  //   userId: user._id,
  //   title: `Registration complete`,
  //   message: "Congratulations! Welcome to ABCD Think Tank.",
  // });

  // response
  res.status(httpStatus.CREATED).send(user);
});

/**
 * Request OTP code
 */
const requestOTP = catchAsync(async (req, res) => {
  // Destructure request body
  const { userId } = req.body;

  // Retrieve user from userId on url(FE) from db(BE)
  const user = await userService.getUserById(userId);

  // Generate otp code
  const otpCode = generateOTP();

  // Save otpCode in user in DB
  await userService.updateUserById(userId, { otpCode: otpCode });

  // Send otp code via Email
  await emailService.sendOTPCodeEmail(user, otpCode);

  // // Send otp code via SMS
  // const phoneNumber = user.mobileNumber;
  // const message = `Your verification code is ${otpCode}. Do not share`;
  // await sendSMS({ to: phoneNumber, message });

  // Response
  res.status(httpStatus.CREATED).send(user);
});

/**
 * Account setup
 */
const accountSetup = catchAsync(async (req, res) => {
  // destructure request body
  const { userId, token, password, otpCode } = req.body;

  // Retrieve user
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "The user does not exist.");
  }

  // Verify OtpCode
  if (user && user.otpCode !== otpCode) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invalid verification code. Please check your phone or email for the correct code.");
  }

  // Verify registration token before proceeding
  await authService.verifyRegistration(token);

  // Update user object
  await userService.updateUserById(user.id, {
    otpCode: null,
    isEmailVerified: true,
    isMobileNumberVerified: true,
    status: "Active",
    password: password,
  });

  // Generate user tokens to enable auto login
  const tokens = await tokenService.generateAuthTokens(user);

  // Fetch updated user object
  const userData = await userService.getUserById(userId);

  // return user object
  res.status(httpStatus.CREATED).send({ user: userData, tokens });
});

/**
 * Login
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

/**
 * Logout
 */
const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.ACCEPTED).send({
    message: "Logout successfully.",
  });
});

/**
 * Refresh tokens
 */
const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

/**
 * Forgot password
 */
const forgotPassword = catchAsync(async (req, res) => {
  const { email, url } = req.body;
  const resetPasswordToken = await tokenService.generateResetPasswordToken(email);

  const user = await userService.getUserByEmail(req.body.email);
  await emailService.sendResetPasswordEmail(user, url, resetPasswordToken);
  res.status(httpStatus.ACCEPTED).send({ message: "A reset link has been sent to your email." });
});

/**
 * Reset password
 */
const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.ACCEPTED).send({ message: "Password recovery is successful" });
});

/**
 * Send verification email
 */
const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(
    req.user
  );
  const user = await userService.getUserByEmail(req.body.email);
  await emailService.sendVerificationEmail(user, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Verify email
 */
const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Resend registration email
 */
const resendRegistrationEmail = catchAsync(async (req, res) => {
  const { userId } = req.body;

  // Fetch user data
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User information not found");
  }

  // Generate registration token for email
  const registrationToken = await tokenService.generateRegisterEmailToken(user);

  // Send user one time registration email to set up their account credentials
  await emailService.sendRegistrationEmail(user, registrationToken);

  // response
  res.status(httpStatus.OK).send({
    message: `Email sent to ${user.email}`,
    user,
  });
});

/**
 * Verify register token
 */
const verifyRegisterToken = catchAsync(async (req, res) => {
  const verifyToken = await authService.verifyRegisterToken(req.body.registrationToken);

  // Retrieve user information
  const user = await userService.getUserById(verifyToken.user);
  res.status(httpStatus.OK).send({ verifyToken, user });
});

/**
 * Verify reset password token
 */
const verifyResetPasswordToken = catchAsync(async (req, res) => {
  const verifyToken = await authService.verifyResetPasswordToken(req.body.resetPasswordToken);
  res.status(httpStatus.OK).send(verifyToken);
});

module.exports = {
  register,
  accountSetup,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  accountSetup,
  requestOTP,
  resendRegistrationEmail,
  verifyRegisterToken,
  verifyResetPasswordToken
};
