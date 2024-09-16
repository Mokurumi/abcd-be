const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const roleSchema = new mongoose.Schema(
  {
    label: {
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
    status: {
      type: String,
      required: true,
      trim: true,
      default: "active",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
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
 * @param {string} label - role label
 * @param {ObjectId} [excludeRoleId] - The id of the role to be excluded
 * @returns {Promise<boolean>}
 */
roleSchema.statics.isRoleExisting = async (label, excludeRoleId) => {
  const role = await this.findOne({
    label,
    _id: { $ne: excludeRoleId }
  });
  return !!role;
};
/**
 * @typedef Role
 */
const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
