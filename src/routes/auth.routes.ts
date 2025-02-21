import express from "express";
import validate from "../middlewares/validate";
import { authValidation } from "../validations";
import { authController } from "../controllers";
import auth from "../middlewares/auth";

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
  auth("USER_MANAGEMENT.CREATE_USER"),
  validate(authValidation.resendRegistrationEmail),
  authController.resendRegistrationEmail
);

// login user
router.post("/login", validate(authValidation.login), authController.login);

// logout user
router.post("/logout", authController.logout);

// refresh token
router.post(
  "/refresh-token",
  // auth('ANY_WITH_AUTH'),
  validate(authValidation.refreshToken),
  authController.refreshToken
);

// reset password
router.post(
  "/reset-password",
  validate(authValidation.resetPassword),
  authController.resetPassword
);

// change password
router.post(
  "/change-password",
  auth("ANY_WITH_AUTH"),
  validate(authValidation.changePassword),
  authController.changePassword
);

// profile
router
  .route("/profile")
  .get(auth("ANY_WITH_AUTH"), authController.getUserProfile)
  .patch(
    auth("ANY_WITH_AUTH"),
    validate(authValidation.updateProfile),
    authController.updateUserProfile
  )
  .delete(auth("ANY_WITH_AUTH"), authController.deleteUserProfile);

router.post(
  "/profile/verify-delete",
  validate(authValidation.verifyDeleteProfile),
  authController.verifyDeleteProfile
);

export default router;
