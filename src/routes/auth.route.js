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

// // Verify email registration
// router.post(
//   "/verify-registration",
//   validate(authValidation.verifyRegistration),
//   authController.verifyRegistration
// );

// // login user
// router.post(
//   "/login",
//   validate(authValidation.login),
//   authController.login
// );

// // logout user
// router.post(
//   "/logout",
//   validate(authValidation.logout),
//   authController.logout
// );

// // reset password
// router.post(
//   "/reset-password",
//   validate(authValidation.resetPassword),
//   authController.resetPassword
// );

// // verify reset password
// router.post(
//   "/verify-reset-password",
//   validate(authValidation.verifyResetPassword),
//   authController.verifyResetPassword
// );

// // change password
// router.post(
//   "/change-password",
//   // auth(),
//   validate(authValidation.changePassword),
//   authController.changePassword
// );

// // refresh token
// router.post(
//   "/refresh-token",
//   validate(authValidation.refreshToken),
//   authController.refreshToken
// );

// // profile
// router.
//   route("/profile")
//   .get(
//     // auth(),
//     authController.getProfile
//   )
//   .patch(
//     // auth(),
//     validate(authValidation.updateProfile),
//     authController.updateProfile
//   )
//   .delete(
//     // auth(),
//     authController.deleteProfile
//   );

// router.post(
//   "/profile/verify-delete",
//   validate(authValidation.verifyDeleteProfile),
//   authController.verifyDeleteProfile
// );

module.exports = router;
