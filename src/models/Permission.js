const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const permissionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: false,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
permissionSchema.plugin(toJSON);
permissionSchema.plugin(paginate);

/**
 * Check if permission exists
 * @param {string} name - name
 * @param {ObjectId} [excludePermissionId] - The id of the permission to be excluded
 * @returns {Promise<boolean>}
 */
permissionSchema.statics.isPermissionExisting = async (name, excludePermissionId) => {
  const permission = await Permission.findOne({
    name,
    value: name.toLowerCase(),
    _id: { $ne: excludePermissionId },
  });
  return !!permission;
};

/**
 * @typedef Permission
 */
const Permission = mongoose.model("Permission", permissionSchema);

module.exports = Permission;
