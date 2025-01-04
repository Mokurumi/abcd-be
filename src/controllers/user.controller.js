const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const { generateTempPassword } = require("../utils");
const { catchAsync } = require("../utils/catchAsync");
const {
  emailService,
  roleService,
  tokenService,
  userService,
} = require("../services");


const createUser = catchAsync(async (req, res) => {

  const tempPassword = generateTempPassword();

  // check if role exists
  const role = await roleService.getRoleById(req.body.role);
  if (!role) {
    throw new ApiError(400, "Role does not exist");
  }

  // if the role.value is super_admin, raise an error
  if (role.value === "super_admin") {
    throw new ApiError(400, "You cannot create a super admin user");
  }

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
  res.status(201).send({
    user,
    message: "User created successfully",
  });
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
    "search",
  ]);

  const options = pick(req.query, ["sortBy", "size", "page"]);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  // if req.user is equal to the user being fetched, return the user object
  if (req.user.id === req.params.userId) {
    return res.send(req.user);
  }
  else {
    const permissions = ["OWNER", "USER_MANAGEMENT", "TRANSACTION_MANAGEMENT", "LOAN_MANAGEMENT"];
    if (!permissions.some(permission => req.user.role.permissions.includes(permission))) {
      throw new ApiError(403, "Forbidden");
    }
    else {
      const user = await userService.getUserById(req.params.userId);
      if (!user) {
        throw new ApiError(404, "User not found");
      }
      res.send(user);
    }
  }
});

const updateUser = catchAsync(async (req, res) => {
  // ensure req.user is the same as the user being updated or the user has USER_MANAGEMENT permission
  if (!req.user.role.permissions.includes("USER_MANAGEMENT") && req.user.id !== req.params.userId) {
    throw new ApiError(403, "Forbidden");
  }

  const user = await userService.updateUserById(req.params.userId, {
    ...req.body,
  });

  res.send({
    user,
    message: "User updated successfully",
  });
});

const lookupUsers = catchAsync(async (req, res) => {
  // if the current user does not have USER_MANAGEMENT permission, add their id to the query
  if (!req.user.role.permissions.includes("USER_MANAGEMENT")) {
    const users = await userService.lookupUsers(
      req.query.active
        ? {
          active: req.query.active,
          _id: req.user._id
        } : {
          _id: req.user._id
        }
    );
    res.send(users);
  }
  else {
    const users = await userService.lookupUsers(
      req.query.active ? { active: req.query.active } : {}
    );
    res.send(users);
  }
});

const deleteUser = catchAsync(async (req, res) => {
  const { userId } = req.params;

  await userService.deleteUserById(userId);

  res.status(200).send({ message: "User account deleted successfully." });
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  lookupUsers,
  deleteUser,
};
