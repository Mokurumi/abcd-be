import Joi from "joi";
import { objectId } from "./custom.validation";

const userProfileImage = {
  body: Joi.object().keys({
    file: Joi.string(),
    owner: Joi.string().required().custom(objectId),
  }),
};

const deleteUserProfileImage = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
};

const getUploadsByOwner = {
  params: Joi.object().keys({
    owner: Joi.string().required().custom(objectId),
  }),
  query: Joi.object().keys({
    category: Joi.string(),
    type: Joi.string().valid("document", "image", "video", "other"),
    sortBy: Joi.string(),
    size: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const deleteUpload = {
  params: Joi.object().keys({
    owner: Joi.string().required().custom(objectId),
    uploadId: Joi.string().required().custom(objectId),
  }),
};

const deleteUploads = {
  params: Joi.object().keys({
    owner: Joi.string().required().custom(objectId),
    category: Joi.string().required(),
  }),
};

export default {
  userProfileImage,
  deleteUserProfileImage,
  getUploadsByOwner,
  deleteUpload,
  deleteUploads,
};
