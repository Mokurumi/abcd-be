const express = require("express");
const auth = require("../middlewares/auth");
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
  auth("USER_MANAGEMENT"),
  userController.lookupUsers
);

module.exports = router;
