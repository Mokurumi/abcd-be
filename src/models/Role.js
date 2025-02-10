const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const { permissions } = require("../constants");

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
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
roleSchema.plugin(toJSON);
roleSchema.plugin(paginate);

/**
 * @typedef Role
 */
const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
