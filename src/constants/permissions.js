const permissions = [
  'ANY_WITH_AUTH',
  'OWNER', // filters by owner unless parent permission is present
  // Role
  'ROLE_MANAGEMENT',
  // User
  'USER_MANAGEMENT',
];

module.exports = permissions;
