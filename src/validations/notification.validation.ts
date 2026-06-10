import Joi from "joi";
import { objectId } from "./custom.validation";

const createNotification = {
  body: Joi.object().keys({
    users: Joi.array().items(Joi.string().custom(objectId)).required(),
    title: Joi.string().required(),
    message: Joi.string().required(),
    category: Joi.string().valid("general").required(),
    type: Joi.string().valid("info", "warning", "error", "success").required(),
    viaEmail: Joi.boolean(),
    viaSMS: Joi.boolean(),
    viaPush: Joi.boolean(),
  }),
};

const getNotifications = {
  query: Joi.object().keys({
    user: Joi.string().custom(objectId),
    category: Joi.string().valid("general"),
    type: Joi.string().valid("info", "warning", "error", "success"),
    read: Joi.boolean(),
    search: Joi.string(),
    sortBy: Joi.string(),
    size: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getNotification = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(objectId),
  }),
};

const markAsRead = {
  body: Joi.object().keys({
    notificationIds: Joi.array()
      .items(Joi.string().custom(objectId))
      .min(1)
      .required(),
    isRead: Joi.boolean().default(true),
  }),
};

const deleteNotifications = {
  body: Joi.array().items(Joi.string().custom(objectId)).min(1).required(),
};

export default {
  createNotification,
  getNotifications,
  getNotification,
  markAsRead,
  deleteNotifications,
};
