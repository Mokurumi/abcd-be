const mongoose = require("mongoose");
const validator = require("validator");
const { toJSON, paginate } = require("./plugins");
const categories = require("../constants/uploadCategories");


const uploadSchema = new mongoose.Schema(
  {
    docURL: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL");
        }
      },
    },
    public_id: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: categories,
      // private: true, // TODO: review this
    },
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      // ref: "User",
      required: true,
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
uploadSchema.plugin(toJSON);
uploadSchema.plugin(paginate);

/**
 * check for existing with owner and category
 * @param {string} category
 * @param {string} owner
 */
uploadSchema.statics.isUploadExisting = async (category, owner) => {
  const upload = await Upload.findOne({
    category,
    owner,
  });
  return !!upload;
};

/**
 * @typedef Upload
 */
const Upload = mongoose.model("Upload", uploadSchema);

module.exports = Upload;
