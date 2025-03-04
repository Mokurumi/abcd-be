import mongoose from "mongoose";
import ApiError from "../utils/ApiError";
import { permissions, permissionMapping } from "../constants";
import { User, Role } from "../models";

/**
 * Check if role exists
 * @param {string} name
 * @param {ObjectId} roleId
 * @returns {Promise<boolean>}
 */
const isRoleExisting = async (
  name: string,
  roleId: string | mongoose.ObjectId | undefined | null
): Promise<boolean> => {
  const role = await Role.findOne({
    name,
    value: name.toLowerCase(),
    _id: { $ne: roleId },
  });
  return !!role;
};

/**
 * Optimize permissions
 * @param {string[]} requestedPermissions
 * @returns {string[]}
 */
const optimizePermissions = (requestedPermissions: string[]): string[] => {
  const optimizedPermissions = new Set(requestedPermissions);

  // Check each modular permission
  for (const [modularPermission, granularPermissions] of Object.entries(
    permissionMapping
  )) {
    // Check if all granular permissions for the module are present
    const hasAllGranularPermissions = granularPermissions.every((permission) =>
      optimizedPermissions.has(permission)
    );

    // If all granular permissions are present, add the modular permission and remove the granular ones
    if (hasAllGranularPermissions) {
      optimizedPermissions.add(modularPermission);
      granularPermissions.forEach((permission) =>
        optimizedPermissions.delete(permission)
      );
    }
  }

  return Array.from(optimizedPermissions);
};

/**
 * Add Role
 * @param {Object} requestBody
 * @returns {Promise<IRole>}
 */
const createRole = async (requestBody: IRole): Promise<IRole> => {
  if (await isRoleExisting(requestBody.name, null)) {
    throw new ApiError(400, "Role already exists");
  }

  // Check if permissions are valid
  const rPermissions = requestBody.permissions || [];
  if (rPermissions && rPermissions.length > 0) {
    for (let i = 0; i < rPermissions.length; i++) {
      if (!permissions.includes(rPermissions[i])) {
        throw new ApiError(400, "Permission does not exist");
      }
    }
  }

  const optimizedPermissions = optimizePermissions(rPermissions);

  // Create the role with optimized permissions
  return await Role.create({
    ...requestBody,
    permissions: optimizedPermissions,
  });
};

/**
 * Query for roles
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.size] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult<IRole>>}
 */
const queryRoles = async (
  filter: any,
  options: any
): Promise<QueryResult<IRole>> => {
  let roles: any = await Role.paginate(
    {
      ...filter,
      value: { $ne: "super_admin" },
    },
    options
  );
  return roles;
};

/**
 * Get Role by id
 * @param {ObjectId} id
 * @returns {Promise<IRole>}
 */
const getRoleById = async (
  id: string | mongoose.ObjectId | undefined
): Promise<IRole | null> => {
  return await Role.findById(id);
};

/**
 * Get Role by value
 * @param {string} value
 * @returns {Promise<IRole>}
 */
const getRoleByValue = async (value: string): Promise<IRole | null> => {
  return Role.findOne({ value });
};

/**
 * Update Role by id
 * @param {ObjectId} roleId
 * @param {Object} updateBody
 * @returns {Promise<IRole>}
 */
const updateRoleById = async (
  roleId: string | mongoose.ObjectId | undefined,
  updateBody: IRole
): Promise<IRole | null> => {
  const role = await getRoleById(roleId);

  if (role?.protected) {
    // if it is protected, update only the permissions and name
    delete updateBody.value;
  }

  if (!role) {
    throw new ApiError(404, "Role not found");
  }
  if (updateBody.name && (await isRoleExisting(updateBody.name, roleId))) {
    throw new ApiError(400, "Role already exists");
  }

  // Check if permissions are valid
  const rPermissions = updateBody.permissions || [];
  if (rPermissions && rPermissions.length > 0) {
    for (let i = 0; i < rPermissions.length; i++) {
      if (!permissions.includes(rPermissions[i])) {
        throw new ApiError(400, "Permission does not exist");
      }
    }
  }

  const optimizedPermissions = optimizePermissions(rPermissions);

  Object.assign(role, { ...updateBody, permissions: optimizedPermissions });
  await role.save();
  return role;
};

/**
 * Lookup Roles
 * @returns {Promise<IRole[]>}
 */
const lookupRoles = async (): Promise<IRole[]> => {
  return Role.find({ active: true, value: { $ne: "super_admin" } }).select(
    "name _id"
  );
};

/**
 * delete Role by id
 * @param {ObjectId} roleId
 * @returns {Promise<IRole>}
 */
const deleteRoleById = async (
  roleId: string | mongoose.ObjectId | undefined
): Promise<IRole | null> => {
  const role = await getRoleById(roleId);
  if (!role) {
    throw new ApiError(404, "Role not found");
  }

  if (role.protected) {
    throw new ApiError(400, "Cannot delete protected role");
  }

  // check if there are users with the role
  const user = await User.findOne({ role: roleId });
  if (user) {
    throw new ApiError(400, "Cannot delete role with users");
  }

  return Role.findByIdAndDelete(roleId);
};

export default {
  createRole,
  queryRoles,
  getRoleById,
  getRoleByValue,
  updateRoleById,
  lookupRoles,
  deleteRoleById,
};
