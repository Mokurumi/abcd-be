const passport = require("passport");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { roleService } = require("../services");


const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(
      new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized")
    );
  }
  req.user = user;

  if (requiredRights.length) {
    const role = await roleService.getRoleById(user.role);
    const userRights = role ? role.permissions : [];
    // check if user has any of the required rights
    const hasRequiredRights = requiredRights.some((requiredRight) =>
      userRights.includes(requiredRight)
    );

    // /**
    //  * If user does not have any of the required rights and the user is not the owner of the resource, return
    //  */
    // if (!hasRequiredRights && req.params.userId !== user._id?.toString()) {
    if (!hasRequiredRights) {
      return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
    }
  }

  resolve();
};


const auth = (...requiredRights) => async (req, res, next) => {
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
