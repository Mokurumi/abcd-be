import pick from "../utils/pick";
import ApiError from "../utils/ApiError";
import catchAsync from "../utils/catchAsync";
import { notificationService, userService } from "../services";

const createNotification = catchAsync(async (req, res) => {
  const users = await userService.getUsersByIds(req.body.users);
  if (users.length !== req.body.users.length) {
    throw new ApiError(400, "Some users do not exist");
  }

  const notification = await notificationService.createNotification(
    req.body,
    (req.user as any)?._id?.toString()
  );
  res.status(201).send({
    notification,
    message: "Notification created successfully",
  });
});

const getNotifications = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["user", "category", "type", "read"]);
  const options = pick(req.query, ["sortBy", "size", "page"]);
  const user = req.user as IUser;

  if (
    !(user?.role as IRole).permissions.includes(
      "NOTIFICATIONS.READ_ALL_NOTIFICATIONS"
    )
  ) {
    filter.user = user._id?.toString();
  }

  const result = await notificationService.queryNotifications(filter, options);
  res.send(result);
});

const getNotification = catchAsync(async (req: any, res) => {
  const notification = await notificationService.getNotificationById(
    req.params.notificationId
  );
  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }
  res.send(notification);
});

const markAsRead = catchAsync(async (req, res) => {
  const { notificationIds, isRead = true } = req.body;
  await notificationService.markNotificationAsRead(
    notificationIds,
    isRead,
    (req.user as any)?._id?.toString()
  );
  res.send({ message: `Marked as ${isRead ? "read" : "unread"} successfully` });
});

const deleteNotifications = catchAsync(async (req, res) => {
  await notificationService.deleteNotifications(
    req.body,
    (req.user as any)?._id?.toString()
  );
  res.send({ message: "Deletion successful" });
});

export default {
  createNotification,
  getNotifications,
  getNotification,
  markAsRead,
  deleteNotifications,
};
