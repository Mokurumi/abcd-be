import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import paginate from "../utils/paginate.plugin";
import { formatPhoneNumber } from "../utils";

const userSchema = new Schema<IUser, UserModel>(
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
      validate(value: string) {
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
      validate(value: string) {
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
      validate(value: string) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong enough");
        }
      },
      private: true,
    },
    role: {
      type: mongoose.SchemaTypes.ObjectId,
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
    protected: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
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
userSchema.plugin(paginate);

/**
 * Check if password matches the user's password
 * @param {string} password - The user's password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
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
    this.password = await bcrypt.hash(this.password as string, 8);
  }
  // format phone number
  this.phoneNumber = formatPhoneNumber(this.phoneNumber as string);
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model<IUser, UserModel>("User", userSchema);

export default User;
