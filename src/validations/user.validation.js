const Joi = require("joi");
const { objectId, phoneNumber } = require("./custom.validation");

const createUser = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    middleName: Joi.string().allow("").allow(null),
    lastName: Joi.string().required(),
    emailAddress: Joi.string().email().required(),
    phoneNumber: Joi.string().required().custom(phoneNumber),
    role: Joi.string().required().custom(objectId),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    emailAddress: Joi.string().email(),
    phoneNumber: Joi.string().custom(phoneNumber),
    active: Joi.boolean(),
    role: Joi.string().custom(objectId),
    isPhoneVerified: Joi.boolean(),
    isEmailVerified: Joi.boolean(),
    dateCreated: Joi.date(),
    search: Joi.string(),
    sortBy: Joi.string(),
    size: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      firstName: Joi.string(),
      middleName: Joi.string().allow("").allow(null),
      lastName: Joi.string(),
      emailAddress: Joi.string().email(),
      phoneNumber: Joi.string().custom(phoneNumber),
      role: Joi.string().custom(objectId),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
