const Joi = require("joi");
const { password, phoneNumber } = require("./custom.validation");

const register = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    middleName: Joi.string(),
    emailAddress: Joi.string().email().required(),
    phoneNumber: Joi.string().required().custom(phoneNumber),
  }),
};

const verifyRegistration = {
  body: Joi.object().keys({
    emailAddress: Joi.string().email().required(),
    token: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    username: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    emailAddress: Joi.string().email(),
    phoneNumber: Joi.string().custom(phoneNumber),
  }),
};

const verifyResetPassword = {
  body: Joi.object().keys({
    emailAddress: Joi.string().email().required(),
    token: Joi.string().required(),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    emailAddress: Joi.string().email().required(),
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().required().custom(password),
  }),
};

const refreshToken = {
  body: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const updateProfile = {
  body: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    middleName: Joi.string(),
    emailAddress: Joi.string().email(),
    phoneNumber: Joi.string().custom(phoneNumber),
  }),
};

const verifyDeleteProfile = {
  body: Joi.object().keys({
    emailAddress: Joi.string().email().required(),
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  verifyRegistration,
  login,
  logout,
  resetPassword,
  resendRegistrationEmail,
  verifyResetPassword,
  changePassword,
  refreshToken,
  updateProfile,
  verifyDeleteProfile
};
