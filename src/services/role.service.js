const ApiError = require("../utils/ApiError");
const { Role, User } = require("../models");
const permissions = require("../constants/permissions");

/**
 * Add Role
 * @param {Object} requestBody
 * @returns {Promise<Role>}
 */
const createRole = async (requestBody) => {
  if (await Role.isRoleExisting(requestBody.name)) {
    throw new ApiError(400, "Role already exists");
  }

  // check if permissions are in the permissions list
  const rPermissions = requestBody.permissions || [];
  if (rPermissions && rPermissions.length > 0) {
    for (let i = 0; i < rPermissions.length; i++) {
      if (!permissions.includes(rPermissions[i])) {
        throw new ApiError(400, "Permission does not exist");
      }
    }
  }

  // // make sure the role has ANY_WITH_AUTH and OWNER permissions, by adding them if they do not exist
  // const defaultPermissions = ['ANY_WITH_AUTH', 'OWNER'];
  // for (let i = 0; i < defaultPermissions.length; i++) {
  //   if (!rPermissions.includes(defaultPermissions[i])) {
  //     rPermissions.push(defaultPermissions[i]);
  //   }
  // }

  return Role.create(requestBody);
};

/**
 * Query for roles
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.size] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryRoles = async (filter, options) => {
  let roles = await Role.paginate(filter, options);
  // filter out the super_admin role
  roles.results = roles.results.filter((role) => role.value !== "super_admin");
  return roles;
};

/**
 * Get Role by id
 * @param {ObjectId} id
 * @returns {Promise<Role>}
 */
const getRoleById = async (id) => {
  return await Role.findById(id);
};

/**
 * Get Role by value
 * @param {string} value
 * @returns {Promise<Role>}
 */
const getRoleByValue = async (value) => {
  return Role.findOne({ value });
};

/**
 * Update Role by id
 * @param {ObjectId} roleId
 * @param {Object} updateBody
 * @returns {Promise<Role>}
 */
const updateRoleById = async (roleId, updateBody) => {
  const role = await getRoleById(roleId);

  if (role.protected) {
    // // if it is protected, do not update
    // throw new ApiError(400, "Cannot update protected role");
    // if it is protected, update only the permissions and name
    delete updateBody.value;
  }

  if (!role) {
    throw new ApiError(404, "Role not found");
  }
  if (
    updateBody.name &&
    (await Role.isRoleExisting(updateBody.name, roleId))
  ) {
    throw new ApiError(400, "Role already exists");
  }

  // check if permissions are valid such that they exist in the database
  const rPermissions = updateBody.permissions || [];
  if (rPermissions && rPermissions.length > 0) {
    for (let i = 0; i < rPermissions.length; i++) {
      if (!permissions.includes(rPermissions[i])) {
        throw new ApiError(400, "Permission does not exist");
      }
    }
  }

  // // make sure the role has ANY_WITH_AUTH and OWNER permissions, by adding them if they do not exist
  // const defaultPermissions = ['ANY_WITH_AUTH', 'OWNER'];
  // for (let i = 0; i < defaultPermissions.length; i++) {
  //   if (!rPermissions.includes(defaultPermissions[i])) {
  //     rPermissions.push(defaultPermissions[i]);
  //   }
  // }

  Object.assign(role, updateBody);
  await role.save();
  return role;
};

/**
 * Lookup Roles
 * @returns {Promise<Role>}
 */
const lookupRoles = async () => {
  return Role.find({ active: true, value: { $ne: "super_admin" } }).select("name _id");
};

/**
 * delete Role by id
 * @param {ObjectId} roleId
 * @returns {Promise<Role>}
 */
const deleteRoleById = async (roleId) => {
  const role = await getRoleById(roleId);
  if (!role) {
    throw new ApiError(404, "Role not found");
  }

  if (role.protected) {
    throw new ApiError(400, "Cannot delete protected role");
  }

  // check if there are users with the role
  const users = await User.find({ role: roleId });
  if (users.length > 0) {
    throw new ApiError(400, "Cannot delete role with users");
  }

  return Role.findByIdAndDelete(roleId);
};

module.exports = {
  createRole,
  queryRoles,
  getRoleById,
  getRoleByValue,
  updateRoleById,
  lookupRoles,
  deleteRoleById,
};
