const express = require("express");
const multer = require("multer");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { uploadValidation } = require("../validations");
const { uploadController } = require("../controllers");

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post(
  "/userProfileImage",
  auth("OWNER", "USER_MANAGEMENT"),
  upload.single("file"),
  validate(uploadValidation.userProfileImage),
  uploadController.userProfileImage
);

router.delete(
  "/deleteUploads/:owner/:category",
  auth("OWNER", "USER_MANAGEMENT"),
  validate(uploadValidation.deleteUploads),
  uploadController.deleteUploads
);

router.delete(
  "/deleteUpload/:owner/:uploadId",
  auth("OWNER", "USER_MANAGEMENT"),
  validate(uploadValidation.deleteUpload),
  uploadController.deleteUpload
);

module.exports = router;
