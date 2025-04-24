import Joi from "joi";
import { objectId, phoneNumber } from "./custom.validation";

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
    isPhoneVerified: Joi.boolean(),
    isEmailVerified: Joi.boolean(),
    role: Joi.string().custom(objectId),
    active: Joi.boolean(),
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

export default { createUser, getUsers, getUser, updateUser, deleteUser };
