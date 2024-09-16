const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const { catchAsync } = require("../utils/catchAsync");
const { permissionService } = require("../services");
const { User } = require("../models");


const createPermission = catchAsync(async (req, res) => {
  // Save new permission to DB
  const newPermission = await permissionService.createPermission(req.body);

  const { permissionName, value } = newPermission;
  const isPermissionActive = value === "Active";

  // Fetch all users that need to be updated
  const usersToUpdate = await User.find();

  // Prepare bulk update operations
  const bulkOperations = usersToUpdate.map(user => {
    if (!user.permission) {
      user.permission = {};
    }

    // Update the user's permission object based on the new permission
    user.permission[permissionName] = isPermissionActive;
    return {
      updateOne: {
        filter: { _id: user.id },
        update: { permission: user.permission }
      }
    };
  });

  // Execute bulk update
  if (bulkOperations.length > 0) {
    await User.bulkWrite(bulkOperations);
  }

  res.status(httpStatus.CREATED).send(newPermission);
});

const getPermissions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["permissionName", "status"]);
  const options = pick(req.query, ["sortBy", "size", "page"]);
  const result = await permissionService.queryPermission(filter, options);
  res.send(result);
});

const getPermission = catchAsync(async (req, res) => {
  const permission = await permissionService.getPermissionById(req.params.permissionId);
  if (!permission) {
    throw new ApiError(httpStatus.NOT_FOUND, "Permission not found");
  }
  res.send(permission);
});

const updatePermission = catchAsync(async (req, res) => {
  const { permissionId } = req.params;
  const permission = await permissionService.updatePermissionById(permissionId, req.body);
  res.send(permission);
});

module.exports = {
  createPermission,
  getPermissions,
  getPermission,
  updatePermission,
};
