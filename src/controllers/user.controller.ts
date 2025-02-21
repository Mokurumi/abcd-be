import ApiError from "../utils/ApiError";
import catchAsync from "../utils/catchAsync";
import pick from "../utils/pick";
import {
  emailService,
  roleService,
  tokenService,
  userService,
} from "../services";
import { generateTempPassword } from "../utils";

const createUser = catchAsync(async (req, res) => {
  const tempPassword = generateTempPassword();

  // check if role exists
  const role = await roleService.getRoleById(req.body.role);
  if (!role) {
    throw new ApiError(400, "Role does not exist");
  }

  // if the role.value is super_admin, raise an error
  if (role.value === "super_admin") {
    throw new ApiError(403, "Forbidden");
  }

  // Create user account
  const user = await userService.createUser({
    ...req.body,
    password: tempPassword,
  });

  // Generate registration token
  const registrationToken = await tokenService.generateRegistrationToken(user);

  // Send user one time registration email to set up their account credentials
  await emailService.sendCreateUserEmail(
    user,
    registrationToken || "",
    tempPassword
  );

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
    "search",
  ]);

  const options = pick(req.query, ["sortBy", "size", "page"]);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  if ((req.user as any)?._id?.toString() === req.params.userId) {
    return res.send(req.user);
  } else {
    const permissions: permissionType[] = [
      "ANY_WITH_AUTH",
      "USER_MANAGEMENT.READ_USER",
    ];
    if (
      !permissions.some((permission) =>
        ((req.user as IUser)?.role as IRole).permissions.includes(permission)
      )
    ) {
      throw new ApiError(403, "Forbidden");
    } else {
      const user = await userService.getUserById(req.params.userId);
      if (!user) {
        throw new ApiError(404, "User not found");
      }
      res.send(user);
    }
  }
});

const updateUser = catchAsync(async (req, res) => {
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
  if (
    !(req.user as any).role.permissions.includes("USER_MANAGEMENT.READ_USER")
  ) {
    const users = await userService.lookupUsers(
      req.query.active
        ? {
            active: req.query.active,
            _id: (req.user as any)?._id,
          }
        : {
            _id: (req.user as any)?._id,
          }
    );
    res.send(users);
  } else {
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

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  lookupUsers,
  deleteUser,
};
