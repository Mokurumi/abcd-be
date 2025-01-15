const mongoose = require("mongoose");
const { toJSON } = require("./plugins");
const { tokenTypes } = require("../constants/tokens");

const tokenSchema = mongoose.Schema(
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
      enum: [...Object.values(tokenTypes),],
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

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
