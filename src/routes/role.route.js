const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { roleValidation } = require("../validations");
const { roleController } = require("../controllers");

const router = express.Router();

router.post(
  "/",
  auth("ROLE_MANAGEMENT"),
  validate(roleValidation.createRole),
  roleController.createRole
);

router.get(
  "/",
  auth("ROLE_MANAGEMENT"),
  validate(roleValidation.getRoles),
  roleController.getRoles
);

router.get(
  "/:roleId",
  // auth("ANY_WITH_AUTH"),
  auth("ROLE_MANAGEMENT"),
  validate(roleValidation.getRole),
  roleController.getRole
);

router.patch(
  "/:roleId",
  auth("ROLE_MANAGEMENT"),
  validate(roleValidation.updateRole),
  roleController.updateRole
);

router.delete(
  "/:roleId",
  auth("ROLE_MANAGEMENT"),
  validate(roleValidation.deleteRole),
  roleController.deleteRole
);

module.exports = router;
