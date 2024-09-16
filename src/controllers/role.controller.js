const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const { catchAsync } = require("../utils/catchAsync");
const { roleService } = require("../services");

const createRole = catchAsync(async (req, res) => {
  const role = await roleService.createRole(req.body);
  res.status(httpStatus.CREATED).send(role);
});

const getRoles = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["label"]);
  const options = pick(req.query, ["sortBy", "size", "page"]);
  const result = await roleService.queryRoles(filter, options);
  res.send(result);
});

const getRole = catchAsync(async (req, res) => {
  const role = await roleService.getRoleById(req.params.roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, "Role not found");
  }
  res.send(role);
});

const updateRole = catchAsync(async (req, res) => {
  const role = await roleService.updateRoleById(req.params.roleId, req.body);
  res.send(role);
});

module.exports = {
  createRole,
  getRoles,
  getRole,
  updateRole,
};
