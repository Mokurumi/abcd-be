import ApiError from "../utils/ApiError";
import catchAsync from "../utils/catchAsync";
import { userService, uploadService } from "../services";

const getUser = async (owner: string, currentUser: IUser) => {
  if (currentUser?._id?.toString() === owner) {
    return;
  } else if (
    !(currentUser.role as IRole)?.permissions?.includes("USER_MANAGEMENT")
  ) {
    throw new ApiError(403, "Forbidden");
  } else {
    const user = await userService.getUserById(owner);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
  }
};

const userProfileImage = catchAsync(async (req, res) => {
  const file = (req as any).file;
  const owner = req.body.owner;

  // verify that the file exists
  if (!file) {
    throw new ApiError(400, "File is required");
  }

  // Save file to database
  const upload = await uploadService.saveAndReplace(
    file,
    "PROFILE_IMG",
    owner,
    (req.user as any)?._id
  );
  if (!upload) {
    throw new ApiError(400, "File not saved");
  }

  // update user profile image
  await userService.updateUserById(owner, { profile_img: upload.docURL });

  res.status(201).send({ url: upload.docURL });
});

const deleteUpload = catchAsync(async (req, res) => {
  const { owner, uploadId } = req.params;

  await getUser(owner, (req as any).user);

  // delete file from cloudinary
  await uploadService.deleteUpload(owner, uploadId);

  res.status(204).send({ message: "File deleted successfully" });
});

const deleteUploads = catchAsync(async (req, res) => {
  const { owner, category } = req.params;

  await getUser(owner, (req as any).user);

  await uploadService.deleteMultipleFiles(owner, category);

  res.status(204).send({ message: "Files deleted successfully" });
});

export default {
  userProfileImage,
  deleteUpload,
  deleteUploads,
};
