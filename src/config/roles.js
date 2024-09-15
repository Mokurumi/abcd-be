const allRoles = {
  user: [
    "GOD_VIEW",
    "COMPANY_ADMIN",
    "MANAGER",
    "EMPLOYEE",
    "ACCOUNTANT",
    "INTERN",
  ],
  admin: [
    "GOD_VIEW",
    "SUPER_ADMIN",
    "ADMIN",
    "CONSULTANT",
    "ENGINEERS",
    "EMPLOYEE_TIER_1",
    "EMPLOYEE_TIER_2",
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
