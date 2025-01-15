const permissions = [
  'ANY_WITH_AUTH',
  'OWNER', // filters by owner unless parent permission is present
  // Roles
  'ROLE_MANAGEMENT',
  // Users
  'USER_MANAGEMENT',
];

module.exports = permissions;
