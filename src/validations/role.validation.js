const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createRole = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    value: Joi.string().required(),
    permissions: Joi.array().items(Joi.string()),
  }),
};

const getRoles = {
  query: Joi.object().keys({
    name: Joi.string(),
    value: Joi.string(),
    active: Joi.boolean(),
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
      name: Joi.string(),
      value: Joi.string(),
      active: Joi.boolean(),
      permissions: Joi.array().items(Joi.string()),
    })
    .min(1),
};

const deleteRole = {
  params: Joi.object().keys({
    roleId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createRole,
  getRoles,
  getRole,
  updateRole,
  deleteRole,
};
