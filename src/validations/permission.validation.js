const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createPermission = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    value: Joi.string().required(),
  }),
};

const getPermissions = {
  query: Joi.object().keys({
    name: Joi.string(),
    value: Joi.string(),
    active: Joi.boolean(),
    sortBy: Joi.string(),
    size: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getPermission = {
  params: Joi.object().keys({
    permissionId: Joi.string().custom(objectId),
  }),
};

const updatePermission = {
  params: Joi.object().keys({
    permissionId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      value: Joi.string(),
      active: Joi.boolean(),
    })
    .min(1),
};

const deletePermission = {
  params: Joi.object().keys({
    permissionId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createPermission,
  getPermissions,
  getPermission,
  updatePermission,
  deletePermission,
};
