const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { roleValidation } = require("../validations");
const { roleController } = require("../controllers");

const router = express.Router();

router
  .route("/")
  .post(
    auth('ROLE_MANAGEMENT'),
    validate(roleValidation.createRole),
    roleController.createRole
  )
  .get(
    auth('ANY_WITH_AUTH'),
    validate(roleValidation.getRoles),
    roleController.getRoles
  );

router
  .route("/:roleId")
  .get(
    auth('ROLE_MANAGEMENT'),
    validate(roleValidation.getRole),
    roleController.getRole
  )
  .patch(
    auth('ROLE_MANAGEMENT'),
    validate(roleValidation.updateRole),
    roleController.updateRole
  );

module.exports = router;
