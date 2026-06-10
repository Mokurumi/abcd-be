import mongoose, { Schema } from "mongoose";
import validator from "validator";
import { toJSON, paginate } from "./plugins";
import { uploadCategories } from "../constants";

const uploadSchema = new Schema<IUpload, UploadModel>(
  {
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      // ref: "User",
      required: true,
    },
    label: {
      type: String,
      default: "Untitled",
      required: true,
    },
    type: {
      type: String,
      enum: ["document", "image", "video", "other"],
      default: "other",
      required: true,
    },
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
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add plugins for JSON conversion and pagination
uploadSchema.plugin(toJSON);
uploadSchema.plugin(paginate);

// Define and export the Upload model
const Upload = mongoose.model<IUpload, UploadModel>("Upload", uploadSchema);

export default Upload;
