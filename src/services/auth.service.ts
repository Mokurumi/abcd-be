import mongoose from "mongoose";

import ApiError from "../utils/ApiError";
import { tokenTypes } from "../constants";

import { Token, User } from "../models";

import tokenService from "./token.service";
import userService from "./user.service";
import emailService from "./email.service";

const raiseErrorForExistingUser = async (
  user: IUser,
  code: number,
  message: string
) => {
  if (!user) {
    throw new ApiError(code, message);
  }

  await User.updateOne(
    { _id: user._id },
    { $set: { lastFailedLogin: Date.now() } }
  ).exec();
  throw new ApiError(code, message);
};

/**
 * Verify registration token
 * @param {string} token
 * @param {string} userId
 * @returns {Promise}
 */
const verifyRegistrationToken = async (
  token: string,
  userId: string | undefined
) => {
  const validToken = await tokenService.verifyToken(
    token,
    tokenTypes.VERIFY_REGISTRATION
  );
  if (!validToken || validToken.user?.toString() !== userId) {
    throw new ApiError(401, "Invalid link");
  }

  await User.updateOne(
    { _id: userId },
    { $set: { isEmailVerified: true, active: true } }
  ).exec();
};

/**
 * Login with username and password
 * @param {string} username
 * @param {string} password
 * @returns {Promise}
 */
const loginUser = async (
  username: string,
  password: string
): Promise<IUser | null> => {
  // User data
  const user = await userService.getUserByPhoneNumberOrEmail(username);

  if (!user) {
    throw new ApiError(404, "Incorrect username or password");
  }

  // Existing users (imported users) and they have no password
  if (user && user.password?.trim() === "") {
    // Generate registration token for email
    const registrationToken = await tokenService.generateRegistrationToken(
      user
    );

    // Send user one time registration email to set up their account credentials
    await emailService.sendRegistrationEmail(user, registrationToken || "");

    await raiseErrorForExistingUser(
      user,
      403,
      "Check your email for an activation link to set up your account"
    );
  }

  // Account not active
  if (!user.active && !user.isEmailVerified) {
    await raiseErrorForExistingUser(
      user,
      401,
      "Your account is not yet active. Please check your email for activation link."
    );
  }

  // Email or password incorrect
  if (!user || !(await user.isPasswordMatch(password))) {
    await raiseErrorForExistingUser(
      user,
      401,
      "Incorrect username or password"
    );
  }

  // Account is disabled
  if (!user.active && !!user.isEmailVerified) {
    await raiseErrorForExistingUser(
      user,
      401,
      "Your account is disabled. Kindly contact support."
    );
  }

  // update lastLogin date
  user.lastLogin = Date.now();
  await user.save();

  return user;
};

/**
 * Logout all instances
 * @param {string} userId
 * @returns {Promise}
 */
const logoutAllInstances = async (
  userId: string | mongoose.ObjectId | undefined
) => {
  await Token.deleteMany({
    user: userId,
    type: tokenTypes.REFRESH,
  });
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @param {string} userId
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken: string) => {
  const refreshTokenDoc = await tokenService.verifyToken(
    refreshToken,
    tokenTypes.REFRESH
  );
  if (!refreshTokenDoc) {
    throw new ApiError(401, "Invalid token");
  }

  await tokenService.deleteToken(refreshTokenDoc.token);
  return await tokenService.generateAuthTokens(refreshTokenDoc.user.toString());
};

/**
 * Verify delete profile token
 * @param {string} token
 * @param {string} userId
 * @returns {Promise}
 */
const verifyDeleteProfileToken = async (
  token: string,
  userId: string | undefined
) => {
  const validToken = await tokenService.verifyToken(
    token,
    tokenTypes.DELETE_PROFILE
  );
  if (!validToken || validToken.user?.toString() !== userId) {
    throw new ApiError(401, "Invalid link");
  }

  await Token.deleteMany({ user: userId });
  await userService.deleteUserById(userId);
};

export default {
  verifyRegistrationToken,
  loginUser,
  logoutAllInstances,
  refreshAuth,
  verifyDeleteProfileToken,
};
