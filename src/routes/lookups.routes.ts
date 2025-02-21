import express from "express";
import auth from "../middlewares/auth";
import validate from "../middlewares/validate";
import { lookupsValidation } from "../validations";
import { roleController, userController } from "../controllers";

const router = express.Router();

router.get("/roles", auth("ANY_WITH_AUTH"), roleController.lookupRoles);

router.get(
  "/users",
  auth("ANY_WITH_AUTH", "USER_MANAGEMENT.READ_USER"),
  validate(lookupsValidation.lookupUsers),
  userController.lookupUsers
);

export default router;
