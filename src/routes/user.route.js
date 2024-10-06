const express = require("express");
const multer = require("multer");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const userValidation = require("../validations/user.validation");
const userController = require("../controllers/user.controller");

// Set up multer for handling file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

const router = express.Router();

router
  .route("/")
  .post(
    auth('USER_MANAGEMENT'),
    validate(userValidation.createUser),
    userController.createUser
  )
  .get(
    auth('USER_MANAGEMENT'),
    validate(userValidation.getUsers),
    userController.getUsers
  );

router
  .route("/:userId")
  .get(
    auth('USER_MANAGEMENT'),
    validate(userValidation.getUser),
    userController.getUser
  )
  .patch(
    auth('USER_MANAGEMENT'),
    validate(userValidation.updateUser),
    userController.updateUser
  )
  .delete(
    auth('USER_MANAGEMENT'),
    validate(userValidation.deleteUser),
    userController.deleteUser
  );

module.exports = router;
