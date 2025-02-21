import express from "express";
import auth from "../middlewares/auth";
import validate from "../middlewares/validate";
import { roleValidation } from "../validations";
import { roleController } from "../controllers";

const router = express.Router();

router
  .route("/")
  .post(
    auth("ROLES.CREATE_ROLE"),
    validate(roleValidation.createRole),
    roleController.createRole
  )
  .get(
    auth("ROLES.READ_ROLE"),
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
    auth("ROLES.UPDATE_ROLE"),
    validate(roleValidation.updateRole),
    roleController.updateRole
  )
  .delete(
    auth("ROLES.DELETE_ROLE"),
    validate(roleValidation.deleteRole),
    roleController.deleteRole
  );

export default router;
