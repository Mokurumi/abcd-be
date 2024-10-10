const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { toJSON, paginate } = require("./plugins");


const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
      default: null,
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isMobilePhone(value, "any")) {
          throw new Error("Invalid phone number");
        }
      },
    },
    profile_img: {
      type: String,
      trim: true,
      default: null,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong enough");
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      ref: "Role",
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    firstTimeLogin: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    lastFailedLogin: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if emailAddress is taken
 * @param {string} emailAddress - The user's emailAddress
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async (emailAddress, excludeUserId) => {
  const user = await User.findOne({ emailAddress, _id: { $ne: excludeUserId } }); // $ne stands for "not equal"
  return !!user;
};

/**
 * Check if phoneNumber is taken
 * @param {string} phoneNumber - The user's phoneNumber
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isPhoneNumberTaken = async (phoneNumber, excludeUserId) => {
  const user = await User.findOne({ phoneNumber, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password - The user's password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  return bcrypt.compare(password, this.password);
};

/**
 * Set the user's password
 * @param {string} password - The user's password
 * @returns {Promise<void>}
 */
userSchema.methods.setPassword = async function (password) {
  this.password = await bcrypt.hash(password, 8);
};

/**
 * pre-save hook
 * - password hash
 * - updated at
 * - created at
 * - email verification token
 * - email verification token expires
 * - password reset token
 * - password reset token expires
 * @param {Function} next - The next function
 * @returns {void}
 */
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model("User", userSchema);

module.exports = User;
