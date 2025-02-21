import express from "express";
import multer from "multer";
import auth from "../middlewares/auth";
import validate from "../middlewares/validate";
import { uploadValidation } from "../validations";
import { uploadController } from "../controllers";

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post(
  "/userProfileImage",
  auth("ANY_WITH_AUTH"),
  upload.single("file"),
  validate(uploadValidation.userProfileImage),
  uploadController.userProfileImage
);

router.delete(
  "/deleteUploads/:owner/:category",
  auth("ANY_WITH_AUTH", "USER_MANAGEMENT"),
  validate(uploadValidation.deleteUploads),
  uploadController.deleteUploads
);

router.delete(
  "/deleteUpload/:owner/:uploadId",
  auth("ANY_WITH_AUTH", "USER_MANAGEMENT"),
  validate(uploadValidation.deleteUpload),
  uploadController.deleteUpload
);

export default router;
