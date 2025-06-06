import { Role, User } from "../models";
import { permissions } from "../constants";
import config from "../config";
import { emailService, tokenService, userService } from "../services";
import { generateTempPassword } from "../utils";

const initializeRoles = async () => {
  // Get modular permissions (parent permissions)
  const modularPermissions = permissions.filter(
    (permission) => !permission.includes(".")
  );

  // Add or update super_admin role with modular permissions
  const adminRole = await Role.findOne({ value: "super_admin" });
  if (!adminRole) {
    await Role.create({
      name: "Super Admin",
      value: "super_admin",
      active: true,
      permissions: modularPermissions, // Assign only modular permissions
      protected: true,
    });
  } else {
    await Role.updateOne(
      { value: "super_admin" },
      { permissions: modularPermissions } // Update with only modular permissions
    );
  }

  // Add or update user role
  const userRole = await Role.findOne({ value: "user" });
  if (!userRole) {
    await Role.create({
      name: "User",
      value: "user",
      active: true,
      permissions: [], // No permissions for regular users
      protected: true,
    });
  }

  // Initialize super admin user
  await initializeSuperAdmin();
};

// initialize super admin user, to be called inside initializeRoles
const initializeSuperAdmin = async () => {
  const tempPassword = generateTempPassword();

  // Step 1: Find the Super Admin role
  const superAdminRole = await Role.findOne({ value: "super_admin" });
  if (!superAdminRole) {
    throw new Error("Super Admin role not found.");
  }

  // Step 2: Find all users with the Super Admin role
  const superAdmins = await User.find({ role: superAdminRole._id });

  // Step 3: Check if there's a Super Admin with the specified email
  const superAdminUser = superAdmins.find(
    (user: IUser) => user.emailAddress === config.superAdmin.email
  );

  if (superAdminUser) {
    // If there’s a Super Admin with the correct email, delete all other Super Admin users
    // await User.deleteMany({ role: superAdminRole._id, _id: { $ne: superAdminUser._id } });
    // update isDeleted to true
    await User.updateMany(
      {
        role: superAdminRole._id,
        _id: { $ne: superAdminUser._id },
      },
      {
        role: null,
        password: generateTempPassword(),
        active: false,
        protected: false,
        isDeleted: true,
        deletedAt: Date.now(),
      }
    );

    // ensure the current super admin is active
    if (!superAdminUser.active) {
      superAdminUser.active = true;
      await superAdminUser.save();
    }
  } else {
    // If no Super Admin has the specified email, delete all Super Admins and create a new one
    // await User.deleteMany({ role: superAdminRole._id });
    // update isDeleted to true
    await User.updateMany(
      { role: superAdminRole._id },
      {
        role: null,
        password: generateTempPassword(),
        active: false,
        protected: false,
        isDeleted: true,
        deletedAt: Date.now(),
      }
    );

    const newUser = await userService.createUser({
      firstName: "Super",
      lastName: "Admin",
      emailAddress: config.superAdmin.email,
      phoneNumber: config.superAdmin.phone,
      role: superAdminRole._id?.toString(),
      active: true,
      password: tempPassword,
      firstTimeLogin: true,
      protected: true,
    });

    // Generate registration token
    const registrationToken = await tokenService.generateRegistrationToken(
      newUser
    );

    // Send user one time registration email to set up their account credentials
    await emailService.sendCreateUserEmail(
      newUser,
      registrationToken || "",
      tempPassword
    );
  }
};

const initializeDatabase = async () => {
  try {
    await initializeRoles();
  } catch (error) {
    console.log(error);
  }
};

export default initializeDatabase;
