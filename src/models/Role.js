const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const permissions = require("../constants/permissions");


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
      required: true,
      default: true,
    },
    permissions: {
      type: [{ type: String, enum: permissions }],
      required: true,
      default: [],
    },
    protected: {
      type: Boolean,
      required: true,
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
 * Check if role already exists
 * @param {string} name - role name
 * @param {ObjectId} [excludeRoleId] - The id of the role to be excluded
 * @returns {Promise<boolean>}
 */
roleSchema.statics.isRoleExisting = async (name, excludeRoleId) => {
  const role = await Role.findOne({
    name,
    value: name.toLowerCase(),
    _id: { $ne: excludeRoleId }
  });
  return !!role;
};
/**
 * @typedef Role
 */
const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
