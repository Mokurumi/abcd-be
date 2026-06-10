const permissionMapping: { [key: string]: string[] } = {
  ROLES: [
    "ROLES.CREATE_ROLE",
    "ROLES.READ_ROLE",
    "ROLES.UPDATE_ROLE",
    "ROLES.DELETE_ROLE",
  ],
  USERS: [
    "USERS.CREATE_USER",
    "USERS.READ_ALL_USERS",
    "USERS.UPDATE_ALL_USERS",
    "USERS.DELETE_USER",
  ],
  NOTIFICATIONS: [
    "NOTIFICATIONS.CREATE_ALL_NOTIFICATIONS",
    "NOTIFICATIONS.READ_ALL_NOTIFICATIONS",
    "NOTIFICATIONS.UPDATE_ALL_NOTIFICATIONS",
    "NOTIFICATIONS.DELETE_ALL_NOTIFICATIONS",
  ],
};

const permissions = [
  ...Object.keys(permissionMapping),
  ...Object.keys(permissionMapping)
    .map((key) => permissionMapping[key])
    .flat(),
];

const tokenTypes = {
  ACCESS: "access",
  REFRESH: "refresh",
  VERIFY_REGISTRATION: "verifyRegistration",
  VERIFY_EMAIL_CHANGE: "verifyEmailChange",
  VERIFY_PHONE: "verifyPhone",
  DELETE_PROFILE: "deleteProfile",
};

const uploadCategories = [
  // USER DOCs
  "PROFILE_IMG",
  // OTHER MODULES
];

export { permissions, permissionMapping, tokenTypes, uploadCategories };
