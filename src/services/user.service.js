const ApiError = require("../utils/ApiError");
const { User, Role } = require("../models");

/**
 * Create a user:
 * @param {Object} requestBody
 * @returns {Promise<User>}
 */
const createUser = async (requestBody) => {
  const checkEmail = await User.isEmailTaken(requestBody.emailAddress);
  const checkPhoneNumber = await User.isPhoneNumberTaken(requestBody.phoneNumber);

  if (checkEmail || checkPhoneNumber) {
    throw new ApiError(400, "User already exists.");
  }

  // check if role exists
  const role = await Role.findById(requestBody.role);
  if (!role) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Role does not exist");
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
const queryUsers = async (filter, options) => {
  const users = await User.paginate(
    {
      ...filter,
      protected: false,
      isDeleted: false
    },
    {
      ...options,
      populate: "role",
    });
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  // populate role
  return User.findById(id)
    .populate({ path: "role" });
};

/**
 * Get user by emailAddress
 * @param {string} emailAddress
 * @returns {Promise<User>}
 */
const getUserByEmail = async (emailAddress) => {
  return await User.findOne({ emailAddress });
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
 * Get user by phoneNumber or emailAddress
 * @param {string} username
 * @returns {Promise<User>}
 */
const getUserByPhoneNumberOrEmail = async (username) => {
  return await User.findOne({ $or: [{ emailAddress: username }, { phoneNumber: username }] });
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
    throw new ApiError(400, "User not found");
  }

  if (updateBody.emailAddress && (await User.isEmailTaken(updateBody.emailAddress, userId))) {
    throw new ApiError(400, "Email already taken");
  }

  if (updateBody.phoneNumber && (await User.isPhoneNumberTaken(updateBody.phoneNumber, userId))) {
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
    if (user.role.value === "super_admin") {
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
const deleteUserById = async (userId) => {
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

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByMobileNumber,
  getUserByEmail,
  getUserByPhoneNumberOrEmail,
  updateUserById,
  lookupUsers,
  deleteUserById,
};
