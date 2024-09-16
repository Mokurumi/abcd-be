const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { Role } = require("../models");

/**
 * Add Role
 * @param {Object} roleBody
 * @returns {Promise<Role>}
 */
const createRole = async (roleBody) => {
  if (await Role.isRoleExisting(roleBody.label)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Role already exists");
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
    updateBody.label &&
    (await Role.isRoleExisting(updateBody.label, roleId))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Role already exists");
  }
  Object.assign(role, updateBody);
  await role.save();
  return role;
};

module.exports = {
  createRole,
  queryRoles,
  getRoleById,
  updateRoleById,
};
