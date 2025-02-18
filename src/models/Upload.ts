import mongoose, { Schema } from "mongoose";
import validator from "validator";
import { toJSON, paginate } from "./plugins";
import { uploadCategories } from "../constants";

const uploadSchema = new Schema<IUpload, UploadModel>(
  {
    docURL: {
      type: String,
      required: true,
      trim: true,
      validate(value: string) {
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
      enum: uploadCategories,
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
    },
  },
  {
    timestamps: true,
  }
);

// Add plugins for JSON conversion and pagination
uploadSchema.plugin(toJSON);
uploadSchema.plugin(paginate);

// Static method to check for existing upload
uploadSchema.statics.isUploadExisting = async function (
  category: string,
  owner: string
): Promise<boolean> {
  const upload = await this.findOne({ category, owner });
  return !!upload;
};

// Define and export the Upload model
const Upload = mongoose.model<IUpload, UploadModel>("Upload", uploadSchema);

export default Upload;
