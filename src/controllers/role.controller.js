const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const { roleService } = require("../services");

const createRole = async (req, res) => {
  const role = await roleService.createRole(req.body);
  res.status(httpStatus.CREATED).send(role);
};

const getRoles = async (req, res) => {
  const filter = pick(req.query, ["name"]);
  const options = pick(req.query, ["sortBy", "size", "page"]);
  const result = await roleService.queryRoles(filter, options);
  res.send(result);
};

const getRole = async (req, res) => {
  const role = await roleService.getRoleById(req.params.roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, "Role not found");
  }
  res.send(role);
};

const updateRole = async (req, res) => {
  const role = await roleService.updateRoleById(req.params.roleId, req.body);
  res.send(role);
};

const deleteRole = async (req, res) => {
  await roleService.deleteRoleById(req.params.roleId);
  res.status(httpStatus.NO_CONTENT).send();
};

module.exports = {
  createRole,
  getRoles,
  getRole,
  updateRole,
  deleteRole,
};
