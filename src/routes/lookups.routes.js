const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { lookupsValidation } = require("../validations");
const {
  roleController,
  userController
} = require("../controllers");


const router = express.Router();

router.get(
  "/roles",
  auth("ANY_WITH_AUTH"),
  roleController.lookupRoles
);

router.get(
  "/users",
  auth("OWNER", "USER_MANAGEMENT"),
  validate(lookupsValidation.lookupUsers),
  userController.lookupUsers
);

module.exports = router;
