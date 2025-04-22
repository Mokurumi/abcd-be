import mongoose from "mongoose";
import paginate from "../utils/paginate.plugin";
import { permissions } from "../constants";

const roleSchema = new mongoose.Schema<IRole, RoleModel>(
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
roleSchema.plugin(paginate);

/**
 * @typedef Role
 */
const Role = mongoose.model<IRole, RoleModel>("Role", roleSchema);

export default Role;
