const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const { catchAsync } = require("../utils/catchAsync");
const { permissionService } = require("../services");


const createPermission = catchAsync(async (req, res) => {
  // Save new permission to DB
  const newPermission = await permissionService.createPermission(req.body);
  res.status(httpStatus.CREATED).send(newPermission);
});

const getPermissions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "active"]);
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

const deletePermission = catchAsync(async (req, res) => {
  await permissionService.deletePermissionById(req.params.permissionId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createPermission,
  getPermissions,
  getPermission,
  updatePermission,
  deletePermission,
};
