const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const permissionValidation = require("../validations/permission.validation");
const permissionController = require("../controllers/permission.controller");

const router = express.Router();

router.post(
  "/",
  // auth("GOD_VIEW"),
  validate(permissionValidation.createPermission),
  permissionController.createPermission
);

router.get(
  "/",
  // auth("GOD_VIEW"),
  validate(permissionValidation.getPermissions),
  permissionController.getPermissions
);

router.get(
  "/:permissionId",
  // auth("GOD_VIEW"),
  validate(permissionValidation.getPermission),
  permissionController.getPermission
);

router.patch(
  "/:permissionId",
  // auth("GOD_VIEW"),
  validate(permissionValidation.updatePermission),
  permissionController.updatePermission
);

module.exports = router;
