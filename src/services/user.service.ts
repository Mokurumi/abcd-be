import mongoose from "mongoose";

import ApiError from "../utils/ApiError";
import { User, Role } from "../models";
import { IRole, IUser } from "../types";

/**
 * Get user by phoneNumber or emailAddress
 * @param {string} username
 * @returns {Promise<User>}
 */
const getUserByPhoneNumberOrEmail = async (
  username: string
): Promise<IUser | null> => {
  return await User.findOne({
    $or: [{ emailAddress: username }, { phoneNumber: username }],
    isDeleted: false,
  });
};

/**
 * Create a user:
 * @param {Object} requestBody
 * @returns {Promise<User>}
 */
const createUser = async (requestBody: any): Promise<IUser> => {
  const userExists = await User.findOne({
    $or: [
      { emailAddress: requestBody.emailAddress },
      { phoneNumber: requestBody.phoneNumber },
    ],
  });

  if (userExists) {
    throw new ApiError(400, "User already exists.");
  }

  return User.create(requestBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc),...
 * @param {number} [options.size] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter: any, options: any) => {
  const users = await User.paginate(
    {
      ...filter,
      protected: false,
      isDeleted: false,
    },
    {
      ...options,
      populate: "role",
    }
  );
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (
  id: string | mongoose.Types.ObjectId | undefined
): Promise<IUser | null> => {
  // populate role
  return User.findById({
    _id: id,
    isDeleted: false,
  }).populate({ path: "role" });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (
  userId: string | mongoose.Types.ObjectId | undefined,
  updateBody: any
) => {
  const user = (await getUserById(userId)) as IUser;
  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const isEmailTaken = await User.findOne({
    emailAddress: updateBody.emailAddress,
    _id: { $ne: userId },
  });
  if (isEmailTaken) {
    throw new ApiError(400, "Email already taken");
  }

  const isPhoneNumberTaken = await User.findOne({
    phoneNumber: updateBody.phoneNumber,
    _id: { $ne: userId },
  });
  if (isPhoneNumberTaken) {
    throw new ApiError(400, "Mobile number already taken");
  }

  // check if role exists
  if (updateBody.role) {
    const role = await Role.findById(updateBody.role);
    if (!role) {
      throw new ApiError(400, "Role does not exist");
    }

    // if the role.value is super_admin, raise an error
    if (role.value === "super_admin") {
      throw new ApiError(400, "You cannot assign a super admin role");
    }

    // if the user is super_admin, raise an error
    if ((user.role as IRole)?.value === "super_admin") {
      throw new ApiError(400, "You cannot update a super admin user");
    }
  }

  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * lookup users
 * @param {Object} query
 * @returns {Promise<User>}
 */
const lookupUsers = async (query = {}) => {
  const newQuery = {
    ...query,
    // active: true,
    protected: false,
    isDeleted: false,
  };

  return User.find(newQuery)
    .select("firstName lastName emailAddress _id")
    .sort({ firstName: 1 });
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (
  userId: string | mongoose.Types.ObjectId | undefined
) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(400, "User not found");
  }
  // await user.remove();
  return User.findByIdAndUpdate(userId, {
    isDeleted: true,
    deletedAt: Date.now(),
  });
};

export default {
  createUser,
  queryUsers,
  getUserById,
  getUserByPhoneNumberOrEmail,
  updateUserById,
  lookupUsers,
  deleteUserById,
};
