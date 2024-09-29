const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { generateTempPassword } = require("../utils");
const { User, Role } = require("../models");

/**
 * Create a user:
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  const checkEmail = await User.isEmailTaken(userBody.emailAddress);
  const checkPhoneNumber = await User.isPhoneNumberTaken(userBody.phoneNumber);

  if (checkEmail || checkPhoneNumber) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User already exists.");
  }

  // check if role exists
  const role = await Role.findById(userBody.role);
  if (!role) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Role does not exist");
  }

  const tempPassword = generateTempPassword();
  userBody.password = tempPassword;

  return User.create(userBody);
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
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by emailAddress
 * @param {string} emailAddress
 * @returns {Promise<User>}
 */
const getUserByEmail = async (emailAddress) => {
  return User.findOne({ emailAddress });
};

/**
 * Get user by phoneNumber
 * @param {string} phoneNumber
 * @returns {Promise<User>}
 */
const getUserByMobileNumber = async (phoneNumber) => {
  return User.findOne({ phoneNumber });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }

  if (updateBody.emailAddress && (await User.isEmailTaken(updateBody.emailAddress, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  if (updateBody.phoneNumber && (await User.isPhoneNumberTaken(updateBody.phoneNumber, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Mobile number already taken");
  }

  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  // await user.remove();
  return User.findByIdAndUpdate(userId, { isDeleted: true });
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByMobileNumber,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
