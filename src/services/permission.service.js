const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { Permission } = require("../models");

/**
 * Add Permission
 * @param {Object} permissionBody
 * @returns {Promise<Permission>}
 */
const createPermission = async (permissionBody) => {
  const { name } = permissionBody;

  // Check if the permission already exists
  const permissionExists = await Permission.isPermissionExisting(name);
  if (permissionExists) {
    // Throw an error if the permission already exists
    throw new ApiError(httpStatus.BAD_REQUEST, "Permission already exists");
  }

  // Create the permission if it does not exist
  return Permission.create(permissionBody);
};


/**
 * Query for permissions
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.size] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryPermission = async (filter, options) => {
  const permissions = await Permission.paginate(filter, options);
  return permissions;
};

/**
 * Get Permission by id
 * @param {ObjectId} id
 * @returns {Promise<Permission>}
 */
const getPermissionById = async (id) => {
  return Permission.findById(id);
};

/**
 * Update Permission by id
 * @param {ObjectId} permissionId
 * @param {Object} updateBody
 * @returns {Promise<Permission>}
 */
const updatePermissionById = async (permissionId, updateBody) => {
  const { name } = updateBody;

  const permission = await getPermissionById(permissionId);
  if (!permission) {
    throw new ApiError(httpStatus.NOT_FOUND, "Permission not found");
  }
  if (
    name &&
    (await Permission.isPermissionExisting(name, permissionId))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Permission already exists");
  }
  Object.assign(permission, updateBody);
  await permission.save();
  return permission;
};

/**
 * Delete Permission by id
 * @param {ObjectId} permissionId
 * @returns {Promise<Permission>}
 */
const deletePermissionById = async (permissionId) => {
  const permission = await getPermissionById(permissionId);
  if (!permission) {
    throw new ApiError(httpStatus.NOT_FOUND, "Permission not found");
  }
  await Permission.findByIdAndDelete(permissionId);
  return permission;
};

module.exports = {
  createPermission,
  queryPermission,
  getPermissionById,
  updatePermissionById,
  deletePermissionById,
};
