const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { roleService } = require("../services");

const createRole = catchAsync(async (req, res) => {
  const role = await roleService.createRole(req.body);
  res.status(201).send({
    role,
    message: "Role created successfully",
  });
});

const getRoles = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "value", "active", "search"]);
  const options = pick(req.query, ["sortBy", "size", "page"]);
  const result = await roleService.queryRoles(filter, options);
  res.send(result);
});

const getRole = catchAsync(async (req, res) => {
  const role = await roleService.getRoleById(req.params.roleId);
  if (!role) {
    throw new ApiError(404, "Role not found");
  }
  res.send(role);
});

const updateRole = catchAsync(async (req, res) => {
  const role = await roleService.updateRoleById(req.params.roleId, req.body);
  res.send({
    role,
    message: "Role updated successfully",
  });
});

const lookupRoles = catchAsync(async (req, res) => {
  const result = await roleService.lookupRoles();
  res.send(result);
});

const deleteRole = catchAsync(async (req, res) => {
  await roleService.deleteRoleById(req.params.roleId);
  res.send({
    message: "Role deleted successfully",
  });
});

module.exports = {
  createRole,
  getRoles,
  getRole,
  updateRole,
  lookupRoles,
  deleteRole,
};
