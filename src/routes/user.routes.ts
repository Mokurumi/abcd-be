import express from "express";
import auth from "../middlewares/auth";
import validate from "../middlewares/validate";
import { userValidation } from "../validations";
import { userController } from "../controllers";

const router = express.Router();

router
  .route("/")
  .post(
    auth("USER_MANAGEMENT.CREATE"),
    validate(userValidation.createUser),
    userController.createUser
  )
  .get(
    auth("USER_MANAGEMENT.READ"),
    validate(userValidation.getUsers),
    userController.getUsers
  );

router
  .route("/:userId")
  .get(
    auth("ANY_WITH_AUTH", "USER_MANAGEMENT.READ"),
    validate(userValidation.getUser),
    userController.getUser
  )
  .patch(
    auth("USER_MANAGEMENT.UPDATE"),
    validate(userValidation.updateUser),
    userController.updateUser
  )
  .delete(
    auth("USER_MANAGEMENT.DELETE"),
    validate(userValidation.deleteUser),
    userController.deleteUser
  );

export default router;
