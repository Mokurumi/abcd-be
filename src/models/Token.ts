import mongoose, { Schema } from "mongoose";
import { toJSON } from "./plugins";
import { tokenTypes } from "../constants";

const tokenSchema = new Schema<IToken, TokenModel>(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(tokenTypes), // Ensures only valid token types
      required: true,
    },
    generatedAuthExp: {
      type: Date,
      default: Date.now,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
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

// Add plugin that converts mongoose to JSON
tokenSchema.plugin(toJSON);

// Define and export the Token model
const Token = mongoose.model<IToken, TokenModel>("Token", tokenSchema);

export default Token;
