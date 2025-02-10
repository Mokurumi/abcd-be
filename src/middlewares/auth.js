const passport = require("passport");
const ApiError = require("../utils/ApiError");
const { roleService } = require("../services");

// Verify callback function
const verifyCallback =
  (req, resolve, reject, requiredRights) => async (err, user, info) => {
    if (err || info || !user) {
      return reject(new ApiError(401, "Unauthorized"));
    }

    req.user = user; // Attach user to the request

    if (requiredRights.length) {
      const role = await roleService.getRoleById(user.role?.toString());
      if (!role) {
        return reject(new ApiError(403, "Forbidden"));
      }

      // Add default permissions
      role.permissions = [...role.permissions, "ANY_WITH_AUTH", "OWNER"];

      const userRights = role.permissions || [];
      const hasRequiredRights = requiredRights.some((requiredRight) =>
        userRights.includes(requiredRight)
      );

      if (!hasRequiredRights) {
        return reject(new ApiError(403, "Forbidden"));
      }
    }

    resolve();
  };

// Authentication middleware
const auth =
  (...requiredRights) =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false },
        verifyCallback(req, resolve, reject, requiredRights)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

module.exports = auth;
