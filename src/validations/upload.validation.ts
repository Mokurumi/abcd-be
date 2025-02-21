import Joi from "joi";
import { objectId } from "./custom.validation";

const userProfileImage = {
  body: Joi.object().keys({
    file: Joi.string(),
    // category: Joi.string().required(),
    owner: Joi.string().required().custom(objectId),
  }),
};

const deleteUserProfileImage = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
};

const deleteUpload = {
  params: Joi.object().keys({
    owner: Joi.string().required().custom(objectId),
    uploadId: Joi.string().custom(objectId),
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
  deleteUpload,
  deleteUploads,
};
