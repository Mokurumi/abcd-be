import express from "express";
import auth from "../middlewares/auth";
import validate from "../middlewares/validate";
import { notificationValidation } from "../validations";
import { notificationController } from "../controllers";

const router = express.Router();

router
  .route("/")
  .post(
    auth("NOTIFICATIONS.CREATE_ALL_NOTIFICATIONS"),
    validate(notificationValidation.createNotification),
    notificationController.createNotification
  )
  .get(
    auth("ANY_WITH_AUTH"),
    validate(notificationValidation.getNotifications),
    notificationController.getNotifications
  )
  .delete(
    auth("ANY_WITH_AUTH"),
    validate(notificationValidation.deleteNotifications),
    notificationController.deleteNotifications
  );

router
  .route("/read")
  .patch(
    auth("ANY_WITH_AUTH"),
    validate(notificationValidation.markAsRead),
    notificationController.markAsRead
  );

router
  .route("/:notificationId")
  .get(
    auth("ANY_WITH_AUTH"),
    validate(notificationValidation.getNotification),
    notificationController.getNotification
  );

export default router;
