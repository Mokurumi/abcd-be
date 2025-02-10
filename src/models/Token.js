const mongoose = require("mongoose");
const { toJSON } = require("./plugins");
const { tokenTypes } = require("../constants");

const tokenSchema = new mongoose.Schema(
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

/**
 * @typedef Token
 */
const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
