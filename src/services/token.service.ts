import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import moment from "moment";

import config from "../config";
import userService from "./user.service";
import { Token } from "../models";
import ApiError from "../utils/ApiError";
import { tokenTypes } from "../constants";

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (
  userId: string | mongoose.Types.ObjectId | undefined,
  expires: any,
  type: string,
  secret = config.jwt.secret
) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: moment(expires).unix(),
    type,
  };
  // TODO: use rsa keys for jwt
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @param {moment} [generatedAuthExp]
 * @returns {Promise<Token>}
 */
const saveToken = async (
  token: string,
  userId: string | mongoose.Types.ObjectId | undefined,
  expires: any,
  type: string,
  blacklisted: boolean = false,
  generatedAuthExp = moment().toDate()
): Promise<IToken | null> => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    generatedAuthExp,
    type,
    blacklisted,
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (
  token: string,
  type: string,
  userId: string | mongoose.Types.ObjectId | undefined
): Promise<IToken | null> => {
  const payload = jwt.verify(token, config.jwt.secret);

  if (userId) {
    if (payload.sub !== userId) {
      throw new ApiError(401, "Unauthorized user");
    }
  } else {
    const user = await userService.getUserById(
      payload.sub as string | mongoose.Types.ObjectId | undefined
    );

    if (!user) {
      throw new ApiError(404, "User not found");
    }
  }

  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  });

  if (!tokenDoc) {
    throw new ApiError(404, "Token not found");
  }
  return tokenDoc;
};

/**
 * Generate register email token
 * @param {string} user
 * @returns {Promise<string>}
 */
const generateRegistrationToken = async (
  user: IUser
): Promise<string | null> => {
  const expires = moment().add(
    config.jwt.verifyRegisterEmailExpirationMinutes,
    "minutes"
  );
  const registerEmailToken = generateToken(
    user._id?.toString(),
    expires,
    tokenTypes.VERIFY_REGISTRATION
  );
  await saveToken(
    registerEmailToken,
    user._id?.toString(),
    expires,
    tokenTypes.VERIFY_REGISTRATION
  );
  return registerEmailToken;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (
  userId: string | mongoose.Types.ObjectId | undefined
): Promise<any> => {
  const accessTokenExpires = moment().add(
    config.jwt.accessExpiration,
    "minutes"
  );
  const accessToken = generateToken(
    userId,
    accessTokenExpires,
    tokenTypes.ACCESS
  );

  const refreshTokenExpires = moment().add(
    config.jwt.refreshExpiration,
    "minutes"
  );
  const refreshToken = generateToken(
    userId,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );
  await saveToken(
    refreshToken,
    userId,
    refreshTokenExpires,
    tokenTypes.REFRESH,
    false,
    accessTokenExpires.toDate()
  );

  return {
    authToken: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refreshToken: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (user: IUser) => {
  const expires = moment().add(
    config.jwt.verifyEmailExpirationMinutes,
    "minutes"
  );
  const verifyEmailToken = generateToken(
    user._id?.toString(),
    expires,
    tokenTypes.VERIFY_REGISTRATION
  );
  await saveToken(
    verifyEmailToken,
    user._id?.toString(),
    expires,
    tokenTypes.VERIFY_REGISTRATION
  );
  return verifyEmailToken;
};

/**
 * Delete token
 * @param {string} token
 * @param {string} type
 * @returns {Promise<User>}
 */
const deleteToken = async (
  token: string | null,
  type: string
): Promise<IToken | null> => {
  const payload = jwt.verify(token || "", config.jwt.secret);
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  });
  if (!tokenDoc) {
    throw new ApiError(404, "Token not found");
  }
  // await tokenDoc.remove();
  await Token.findOneAndDelete({ token, type });
  return tokenDoc;
};

/**
 * Generate delete profile token
 * @param {string} user
 * @returns {Promise<string>}
 */
const generateDeleteProfileToken = async (
  user: IUser
): Promise<string | null> => {
  const expires = moment().add(
    config.jwt.verifyEmailExpirationMinutes,
    "minutes"
  );
  const deleteProfileToken = generateToken(
    user._id?.toString(),
    expires,
    tokenTypes.DELETE_PROFILE
  );
  await saveToken(
    deleteProfileToken,
    user._id?.toString(),
    expires,
    tokenTypes.DELETE_PROFILE
  );
  return deleteProfileToken;
};

export default {
  generateToken,
  // saveToken,
  verifyToken,
  deleteToken,
  generateAuthTokens,
  generateVerifyEmailToken,
  generateRegistrationToken,
  generateDeleteProfileToken,
};
