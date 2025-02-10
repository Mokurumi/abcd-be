const permissions = [
  "ANY_WITH_AUTH",
  "OWNER", // filters by owner unless parent permission is present
  // Roles
  "ROLE_MANAGEMENT",
  // Users
  "USER_MANAGEMENT",
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

module.exports = {
  permissions,
  tokenTypes,
  uploadCategories,
};
