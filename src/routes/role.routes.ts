import express from "express";
import auth from "../middlewares/auth";
import validate from "../middlewares/validate";
import { roleValidation } from "../validations";
import { roleController } from "../controllers";

const router = express.Router();

router
  .route("/")
  .post(
    auth("ROLE_MANAGEMENT"),
    validate(roleValidation.createRole),
    roleController.createRole
  )
  .get(
    auth("ROLE_MANAGEMENT"),
    validate(roleValidation.getRoles),
    roleController.getRoles
  );

router
  .route("/:roleId")
  .get(
    auth("ANY_WITH_AUTH"),
    validate(roleValidation.getRole),
    roleController.getRole
  )
  .patch(
    auth("ROLE_MANAGEMENT"),
    validate(roleValidation.updateRole),
    roleController.updateRole
  )
  .delete(
    auth("ROLE_MANAGEMENT"),
    validate(roleValidation.deleteRole),
    roleController.deleteRole
  );

export default router;
