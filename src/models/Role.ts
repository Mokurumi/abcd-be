import mongoose from "mongoose";
import { toJSON, paginate } from "./plugins";
import { permissions } from "../constants";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    permissions: [
      {
        type: String,
        enum: permissions,
      },
    ],
    protected: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
roleSchema.plugin(toJSON);
roleSchema.plugin(paginate);

/**
 * @typedef Role
 */
const Role: RoleModel = mongoose.model<IRole, RoleModel>("Role", roleSchema);

export default Role;
