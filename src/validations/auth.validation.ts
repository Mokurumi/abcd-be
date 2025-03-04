import Joi from "joi";
import { objectId, password, phoneNumber } from "./custom.validation";

const register = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    middleName: Joi.string().allow("").allow(null),
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

const logout = {
  body: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const resetPassword = {
  // at least one of the two fields is required
  body: Joi.object()
    .keys({
      emailAddress: Joi.string().email(),
      phoneNumber: Joi.string().custom(phoneNumber),
    })
    .or("emailAddress", "phoneNumber"),
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
    middleName: Joi.string().allow("").allow(null),
    // emailAddress: Joi.string().email(),
    phoneNumber: Joi.string().custom(phoneNumber),
  }),
};

const verifyDeleteProfile = {
  body: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
    token: Joi.string().required(),
  }),
};

export default {
  register,
  verifyRegistration,
  resendRegistrationEmail,
  login,
  logout,
  resetPassword,
  changePassword,
  refreshToken,
  updateProfile,
  verifyDeleteProfile,
};
