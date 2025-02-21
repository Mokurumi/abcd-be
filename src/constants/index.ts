const permissions = [
  // "ANY_WITH_AUTH",
  // Roles
  "ROLE_MANAGEMENT",
  "ROLE_MANAGEMENT.CREATE",
  "ROLE_MANAGEMENT.READ",
  "ROLE_MANAGEMENT.UPDATE",
  "ROLE_MANAGEMENT.DELETE",
  // Users
  "USER_MANAGEMENT",
  "USER_MANAGEMENT.CREATE",
  "USER_MANAGEMENT.READ",
  "USER_MANAGEMENT.UPDATE",
  "USER_MANAGEMENT.DELETE",
];

const permissionMapping: { [key: string]: string[] } = {
  // Roles
  ROLE_MANAGEMENT: [
    "ROLE_MANAGEMENT.CREATE",
    "ROLE_MANAGEMENT.READ",
    "ROLE_MANAGEMENT.UPDATE",
    "ROLE_MANAGEMENT.DELETE",
  ],
  // Users
  USER_MANAGEMENT: [
    "USER_MANAGEMENT.CREATE",
    "USER_MANAGEMENT.READ",
    "USER_MANAGEMENT.UPDATE",
    "USER_MANAGEMENT.DELETE",
  ],
};

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
