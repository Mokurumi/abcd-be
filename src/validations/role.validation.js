const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createRole = {
  body: Joi.object().keys({
    label: Joi.string().required(),
    value: Joi.string().required(),
    status: Joi.string(),
  }),
};

const getRoles = {
  query: Joi.object().keys({
    label: Joi.string(),
    value: Joi.string(),
    status: Joi.string(),
    sortBy: Joi.string(),
    size: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getRole = {
  params: Joi.object().keys({
    roleId: Joi.string().custom(objectId),
  }),
};

const updateRole = {
  params: Joi.object().keys({
    roleId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      label: Joi.string(),
      status: Joi.string(),
    })
    .min(1),
};

module.exports = {
  createRole,
  getRoles,
  getRole,
  updateRole,
};
