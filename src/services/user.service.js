const httpStatus = require("http-status");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create a user: Job_Seeker, Employer, Super_admins (cvstudio admins) => others to be added
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  const checkEmail = await User.isEmailTaken(userBody.email);
  const checkPhoneNumber = await User.isMobileNumberTaken(userBody.mobileNumber);

  if (checkEmail || checkPhoneNumber) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User already exists.");
  }

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
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
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
  await user.findByIdAndUpdate(userId, { isDeleted: true });
  return user;
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
