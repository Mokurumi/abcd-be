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

  // console.log("file", file);
  // verify that the file exists
  if (!file) {
    throw new ApiError(httpStatus.BAD_REQUEST, "File is required");
  }

  // Save file to database
  const upload = await uploadService.saveFile(
    file,
    "PROFILE_IMG",
    owner,
    req.user._id
  );

  // update user profile image
  await userService.updateUserById(owner, { profile_img: upload.docURL });

  res.status(httpStatus.CREATED).send({ url: upload.docURL });
});

module.exports = {
  userProfileImage,
};
