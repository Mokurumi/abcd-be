const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const roleValidation = require("../validations/role.validation");
const roleController = require("../controllers/role.controller");

const router = express.Router();

router.post(
  "/",
  // auth("GOD_VIEW"),
  validate(roleValidation.createRole),
  roleController.createRole
);

router.get(
  "/",
  // auth("GOD_VIEW"),
  validate(roleValidation.getRoles),
  roleController.getRoles
);

router.get(
  "/:roleId",
  // auth("GOD_VIEW"),
  validate(roleValidation.getRole),
  roleController.getRole
);

router.patch(
  "/:roleId",
  // auth("GOD_VIEW"),
  validate(roleValidation.updateRole),
  roleController.updateRole
);

module.exports = router;
