import express from "express";
import multer from "multer";
import auth from "../middlewares/auth";
import validate from "../middlewares/validate";
import { uploadValidation } from "../validations";
import { uploadController } from "../controllers";

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const router = express.Router();

router.post(
  "/userProfileImage",
  auth("ANY_WITH_AUTH"),
  upload.single("file"),
  validate(uploadValidation.userProfileImage),
  uploadController.userProfileImage
);

router.delete(
  "/deleteUserProfileImage/:userId",
  auth("USERS.UPDATE_ALL_USERS"),
  validate(uploadValidation.deleteUserProfileImage),
  uploadController.deleteUserProfileImage
);

router
  .route("/:owner")
  .get(
    auth("ANY_WITH_AUTH"),
    validate(uploadValidation.getUploadsByOwner),
    uploadController.getUploadsByOwner
  );

router.delete(
  "/deleteUploads/:owner/:category",
  auth("ANY_WITH_AUTH"),
  validate(uploadValidation.deleteUploads),
  uploadController.deleteUploads
);

router.delete(
  "/deleteUpload/:owner/:uploadId",
  auth("ANY_WITH_AUTH"),
  validate(uploadValidation.deleteUpload),
  uploadController.deleteUpload
);

export default router;
