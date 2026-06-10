import mongoose, { Schema } from "mongoose";
import { toJSON, paginate } from "./plugins";

const notificationSchema = new Schema<INotification, NotificationModel>(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["general"],
      required: true,
    },
    type: {
      type: String,
      enum: ["info", "warning", "error", "success"],
      required: true,
    },
    viaEmail: {
      type: Boolean,
      default: false,
    },
    viaSMS: {
      type: Boolean,
      default: false,
    },
    viaPush: {
      type: Boolean,
      default: false,
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

notificationSchema.plugin(toJSON);
notificationSchema.plugin(paginate);

const Notification = mongoose.model<INotification, NotificationModel>(
  "Notification",
  notificationSchema
);

export default Notification;
