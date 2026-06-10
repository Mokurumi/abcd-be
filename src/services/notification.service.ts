import { Notification } from "../models";
import userService from "./user.service";
import emailService from "./email.service";

const createNotification = async (
  notificationBody: NotificationRequest,
  userId?: string | undefined
) => {
  const requestBody: any = {
    title: notificationBody.title,
    message: notificationBody.message,
    category: notificationBody.category,
    type: notificationBody.type,
    read: false,
  };

  if (notificationBody.viaEmail) requestBody.viaEmail = notificationBody.viaEmail;
  if (notificationBody.viaSMS) requestBody.viaSMS = notificationBody.viaSMS;
  if (notificationBody.viaPush) requestBody.viaPush = notificationBody.viaPush;
  if (userId) requestBody.createdBy = userId;

  const results = await Promise.all(
    notificationBody.users.map(async (user) => {
      requestBody.user = user;
      return Notification.create({ ...requestBody });
    })
  );

  const emailNotifications = results.filter((n) => n.viaEmail);
  if (emailNotifications.length > 0) {
    const users = await Promise.all(
      emailNotifications.map((n) => userService.getUserById(n.user?.toString()))
    );
    await emailService.sendMassEmail(
      users.filter((u) => u !== null),
      notificationBody.title,
      notificationBody.message
    );
  }

  return results;
};

const queryNotifications = async (filter: any, options: any) => {
  return Notification.paginate({ ...filter, isDeleted: false }, options);
};

const getNotificationById = async (id: string) => {
  return Notification.findOne({ _id: id, isDeleted: false });
};

const markNotificationAsRead = async (
  notificationIds: string[],
  isRead: boolean = true,
  userId: string | undefined
) => {
  const updateData: any = { read: isRead };
  if (isRead) updateData.readAt = new Date();
  return Notification.updateMany(
    { _id: { $in: notificationIds }, user: userId },
    { $set: updateData }
  );
};

const deleteNotifications = async (
  notificationIds: string[],
  userId: string | undefined
) => {
  return Notification.updateMany(
    { _id: { $in: notificationIds }, user: userId },
    { $set: { isDeleted: true } }
  );
};

const sendNotification = async (
  notificationBody: NotificationRequest,
  userId?: string | undefined
) => {
  await createNotification(notificationBody, userId);
};

export default {
  createNotification,
  queryNotifications,
  getNotificationById,
  markNotificationAsRead,
  deleteNotifications,
  sendNotification,
};
