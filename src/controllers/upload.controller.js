const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const { catchAsync } = require("../utils/catchAsync");
const {
  userService,
  uploadService,
} = require("../services");


const userProfileImage = catchAsync(async (req, res) => {
  const file = req.file;
  const owner = req.body.owner;

  const user = await userService.getUserById(owner);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // verify that the file exists
  if (!file) {
    throw new ApiError(httpStatus.BAD_REQUEST, "File is required");
  }

  // Save file to database
  const upload = await uploadService.saveAndReplace(
    file,
    "PROFILE_IMG",
    owner,
    req.user._id
  );

  // update user profile image
  await userService.updateUserById(owner, { profile_img: upload.docURL });

  res.status(httpStatus.CREATED).send({ url: upload.docURL });
});

const deleteUpload = catchAsync(async (req, res) => {
  const { owner, uploadId } = req.params;

  const user = await userService.getUserById(owner);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // delete file from cloudinary
  await uploadService.deleteUpload(owner, uploadId);

  res.status(httpStatus.NO_CONTENT).send();
});

const deleteUploads = catchAsync(async (req, res) => {
  const { owner, category } = req.params;

  const user = await userService.getUserById(owner);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  await uploadService.deleteMultipleFiles(owner, category);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  userProfileImage,
  deleteUpload,
  deleteUploads,
};
