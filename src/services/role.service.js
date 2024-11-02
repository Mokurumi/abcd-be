const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { Role } = require("../models");
const permissions = require("../constants/permissions");

/**
 * Add Role
 * @param {Object} requestBody
 * @returns {Promise<Role>}
 */
const createRole = async (requestBody) => {
  if (await Role.isRoleExisting(requestBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Role already exists");
  }

  // check if permissions are in the permissions list
  const rPermissions = requestBody.permissions || [];
  if (rPermissions && rPermissions.length > 0) {
    for (let i = 0; i < rPermissions.length; i++) {
      if (!permissions.includes(rPermissions[i])) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Permission does not exist");
      }
    }
  }

  // make sure the role has ANY_WITH_AUTH permission, by adding it if it does not exist
  if (!rPermissions.includes('ANY_WITH_AUTH')) {
    rPermissions.push('ANY_WITH_AUTH');
  }

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
  const roles = await Role.paginate(filter, options);
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
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, "Role not found");
  }
  if (
    updateBody.name &&
    (await Role.isRoleExisting(updateBody.name, roleId))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Role already exists");
  }

  // check if permissions are valid such that they exist in the database
  const rPermissions = updateBody.permissions || [];
  if (rPermissions && rPermissions.length > 0) {
    for (let i = 0; i < rPermissions.length; i++) {
      if (!permissions.includes(rPermissions[i])) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Permission does not exist");
      }
    }
  }

  // make sure the role has ANY_WITH_AUTH permission, by adding it if it does not exist
  if (!rPermissions.includes('ANY_WITH_AUTH')) {
    rPermissions.push('ANY_WITH_AUTH');
  }

  Object.assign(role, updateBody);
  await role.save();
  return role;
};

/**
 * Lookup Roles
 * @returns {Promise<Role>}
 */
const lookupRoles = async () => {
  return Role.find({ active: true }).select("name _id");
};

module.exports = {
  createRole,
  queryRoles,
  getRoleById,
  getRoleByValue,
  updateRoleById,
  lookupRoles
};
