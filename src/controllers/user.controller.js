const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const { catchAsync } = require("../utils/catchAsync");
const { Permission } = require("../models");
const {
  userService,
  emailService,
  tokenService,
} = require("../services");

const createUser = catchAsync(async (req, res) => {

  // Get all available permissions
  const availablePermissions = await Permission.find({ status: "Active" });

  // Assign permissions to a user
  const userPermissions = {};
  for (const permission of availablePermissions) {
    const { permissionName, value } = permission;
    userPermissions[permissionName] = value === "Active";
  }

  // Create user account
  const user = await userService.createUser({
    ...req.body,
    permission: userPermissions,
  });

  // Generate registration token
  const registrationToken = await tokenService.generateRegisterEmailToken(user);

  // Send user one time registration email to set up their account credentials
  await emailService.sendRegistrationEmail(user, registrationToken);

  // return user object
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    "firstName",
    "middleName",
    "lastName",
    "emailAddress",
    "phoneNumber",
    "isPhoneVerified",
    "isEmailVerified",
    "image",
    "role",
    "status",
    "createdAt",
    "updatedAt",
    "isDeleted",
  ]);

  // Extract start and end dates from the request query
  const startDate = req.query.startDate;
  const endDate = req.query.endDate; // e.g., ?startDate=2023-10-01&endDate=2023-10-15

  // If both start and end dates are provided, add dateCreated to the filter
  if (startDate && endDate) {
    filter.dateCreated = {
      $gte: new Date(startDate), // $gte stands for "greater than or equal"
      $lte: new Date(endDate), // $lte stands for "less than or equal"
    };
  }

  const options = pick(req.query, ["sortBy", "size", "page"]);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, {
    ...req.body,
  });

  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await userService.getUserById(userId);
  await emailService.sendUserProfileDeleteEmail(user);

  await userService.deleteUserById(req.params.userId);

  res.status(httpStatus.OK).send({ message: "User account deleted successfully." });
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
