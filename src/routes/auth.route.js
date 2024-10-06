const express = require("express");
const validate = require("../middlewares/validate");
const authValidation = require("../validations/auth.validation");
const authController = require("../controllers/auth.controller");
const auth = require("../middlewares/auth");

const router = express.Router();

// Register a new user
router.post(
  "/register",
  validate(authValidation.register),
  authController.register
);

// Verify email registration
router.post(
  "/verify-registration",
  validate(authValidation.verifyRegistration),
  authController.verifyRegistration
);

// Resend email registration
router.post(
  "/resend-registration-email",
  validate(authValidation.resendRegistrationEmail),
  authController.resendRegistrationEmail
);

// login user
router.post(
  "/login",
  validate(authValidation.login),
  authController.login
);

// logout user
router.post(
  "/logout",
  // validate(authValidation.logout),
  auth('USER_PROFILE'),
  authController.logout
);

// refresh token
router.post(
  "/refresh-token",
  auth('USER_PROFILE'),
  validate(authValidation.refreshToken),
  authController.refreshToken
);

// reset password
router.post(
  "/reset-password",
  validate(authValidation.resetPassword),
  authController.resetPassword
);

// verify reset password
router.post(
  "/verify-reset-password",
  validate(authValidation.verifyResetPassword),
  authController.verifyResetPassword
);

// change password
router.post(
  "/change-password",
  auth('USER_PROFILE'),
  validate(authValidation.changePassword),
  authController.changePassword
);

// profile
router.
  route("/profile")
  .get(
    auth('USER_PROFILE'),
    authController.getUserProfile
  )
  .patch(
    auth('USER_PROFILE'),
    validate(authValidation.updateProfile),
    authController.updateUserProfile
  );
// .delete(
//   // auth('USER_PROFILE'),
//   authController.deleteProfile
// );

// router.post(
//   "/profile/verify-delete",
//   validate(authValidation.verifyDeleteProfile),
//   authController.verifyDeleteProfile
// );

module.exports = router;
