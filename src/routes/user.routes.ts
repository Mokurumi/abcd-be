import express from "express";
import auth from "../middlewares/auth";
import validate from "../middlewares/validate";
import { userValidation } from "../validations";
import { userController } from "../controllers";

const router = express.Router();

router
  .route("/")
  .post(
    auth("USER_MANAGEMENT"),
    validate(userValidation.createUser),
    userController.createUser
  )
  .get(
    auth("USER_MANAGEMENT"),
    validate(userValidation.getUsers),
    userController.getUsers
  );

router
  .route("/:userId")
  .get(
    auth("OWNER", "USER_MANAGEMENT"),
    validate(userValidation.getUser),
    userController.getUser
  )
  .patch(
    auth("USER_MANAGEMENT"),
    validate(userValidation.updateUser),
    userController.updateUser
  )
  .delete(
    auth("OWNER", "USER_MANAGEMENT"),
    validate(userValidation.deleteUser),
    userController.deleteUser
  );

export default router;
