const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const register = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    middleName: Joi.string(),
    emailAddress: Joi.string().email().required(),
    phoneNumber: Joi.string().required(),
    role: Joi.string().valid("user", "admin"),
    // password: Joi.string().custom(password),
  }),
};

const requestOTP = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const resendRegistrationEmail = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const accountSetup = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    token: Joi.string().required(),
    otpCode: Joi.string().required(),
    password: Joi.string().custom(password).required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    url: Joi.string().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const verifyRegisterToken = {
  body: Joi.object().keys({
    registrationToken: Joi.string().required(),
  }),
};

const verifyResetPasswordToken = {
  body: Joi.object().keys({
    resetPasswordToken: Joi.string().required(),
  }),
};

module.exports = {
  register,
  accountSetup,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  requestOTP,
  resendRegistrationEmail,
  verifyRegisterToken,
  verifyResetPasswordToken
};
