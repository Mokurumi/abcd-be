const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { Role } = require("../models");
const permissions = require("../config/permissions");

/**
 * Add Role
 * @param {Object} roleBody
 * @returns {Promise<Role>}
 */
const createRole = async (roleBody) => {
  if (await Role.isRoleExisting(roleBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Role already exists");
  }

  // check if permissions are in the permissions list
  const rPermissions = roleBody.permissions;
  if (rPermissions && rPermissions.length > 0) {
    for (let i = 0; i < rPermissions.length; i++) {
      if (!permissions.includes(rPermissions[i])) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Permission does not exist");
      }
    }
  }

  return Role.create(roleBody);
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
  return Role.findById(id);
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
  const rPermissions = updateBody.permissions;
  if (rPermissions && rPermissions.length > 0) {
    for (let i = 0; i < rPermissions.length; i++) {
      if (!permissions.includes(rPermissions[i])) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Permission does not exist");
      }
    }
  }

  Object.assign(role, updateBody);
  await role.save();
  return role;
};

/**
 * Delete Role by id
 * @param {ObjectId} roleId
 * @returns {Promise<Role>}
 */
const deleteRoleById = async (roleId) => {
  const role = await getRoleById(roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, "Role not found");
  }
  await Role.findByIdAndDelete(roleId);
  return role;
};

module.exports = {
  createRole,
  queryRoles,
  getRoleById,
  updateRoleById,
  deleteRoleById,
};
