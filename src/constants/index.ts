const permissionMapping: { [key: string]: string[] } = {
  // Roles
  ROLE_MANAGEMENT: [
    "ROLE_MANAGEMENT.CREATE_ROLE",
    "ROLE_MANAGEMENT.READ_ROLE",
    "ROLE_MANAGEMENT.UPDATE_ROLE",
    "ROLE_MANAGEMENT.DELETE_ROLE",
  ],
  // Users
  USER_MANAGEMENT: [
    "USER_MANAGEMENT.CREATE_USER",
    "USER_MANAGEMENT.READ_USER",
    "USER_MANAGEMENT.UPDATE_USER",
    "USER_MANAGEMENT.DELETE_USER",
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
