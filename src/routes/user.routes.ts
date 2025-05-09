import express from "express";
import auth from "../middlewares/auth";
import validate from "../middlewares/validate";
import { userValidation } from "../validations";
import { userController } from "../controllers";

const router = express.Router();

router
  .route("/")
  .post(
    auth("USERS.CREATE_USER"),
    validate(userValidation.createUser),
    userController.createUser
  )
  .get(
    auth("USERS.READ_ALL_USERS"),
    validate(userValidation.getUsers),
    userController.getUsers
  );

router
  .route("/:userId")
  .get(
    auth("ANY_WITH_AUTH"),
    validate(userValidation.getUser),
    userController.getUser
  )
  .patch(
    auth("USERS.UPDATE_ALL_USERS"),
    validate(userValidation.updateUser),
    userController.updateUser
  )
  .delete(
    auth("USERS.DELETE_USER"),
    validate(userValidation.deleteUser),
    userController.deleteUser
  );

export default router;
