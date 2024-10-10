const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const { generateTempPassword } = require("../utils");
const { catchAsync } = require("../utils/catchAsync");
const {
  userService,
  emailService,
  tokenService,
} = require("../services");


const createUser = catchAsync(async (req, res) => {

  const tempPassword = generateTempPassword();

  // Create user account
  const user = await userService.createUser({
    ...req.body,
    password: tempPassword,
  });

  // Generate registration token
  const registrationToken = await tokenService.generateRegistrationToken(user);

  // Send user one time registration email to set up their account credentials
  await emailService.sendCreateUserEmail(user, registrationToken, tempPassword);

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
    "role",
    "active",
    "createdAt",
    "isDeleted",
  ]);

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

  await userService.deleteUserById(userId);

  res.status(httpStatus.OK).send({ message: "User account suspended successfully." });
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
