import Joi from "joi";
import { objectId } from "./custom.validation";
import { permissionMapping } from "../constants";

const createRole = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    value: Joi.string().required(),
    permissions: Joi.array().items(
      Joi.string().valid(
        ...Object.keys(permissionMapping)
          .map((key) => permissionMapping[key])
          .flat()
      )
    ),
  }),
};

const getRoles = {
  query: Joi.object().keys({
    name: Joi.string(),
    value: Joi.string(),
    active: Joi.boolean(),
    search: Joi.string(),
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
      permissions: Joi.array().items(
        Joi.string().valid(
          ...Object.keys(permissionMapping)
            .map((key) => permissionMapping[key])
            .flat()
        )
      ),
    })
    .min(1),
};

const deleteRole = {
  params: Joi.object().keys({
    roleId: Joi.string().custom(objectId),
  }),
};

export default { createRole, getRoles, getRole, updateRole, deleteRole };
