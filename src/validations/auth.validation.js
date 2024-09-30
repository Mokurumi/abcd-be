const Joi = require("joi");
const { objectId, password, phoneNumber } = require("./custom.validation");

const register = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    middleName: Joi.string(),
    emailAddress: Joi.string().email().required(),
    phoneNumber: Joi.string().required().custom(phoneNumber),
    password: Joi.string().required().custom(password),
  }),
};

const verifyRegistration = {
  body: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
    token: Joi.string().required(),
  }),
};

const resendRegistrationEmail = {
  body: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
    // emailAddress: Joi.string().email().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    // username: Joi.string().email().required(),
    // validate username as email or phone number
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

// const logout = {
//   body: Joi.object().keys({
//     token: Joi.string().required(),
//   }),
// };

const resetPassword = {
  body: Joi.object().keys({
    emailAddress: Joi.string().email(),
    phoneNumber: Joi.string().custom(phoneNumber),
  }),
};

const verifyResetPassword = {
  body: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
    token: Joi.string().required(),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
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
    userId: Joi.string().required().custom(objectId),
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  verifyRegistration,
  resendRegistrationEmail,
  login,
  // logout,
  resetPassword,
  verifyResetPassword,
  changePassword,
  refreshToken,
  updateProfile,
  verifyDeleteProfile
};
