const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { Upload } = require("../models");
const userService = require("./user.service");
const { uploadFile, deleteFiles } = require("../utils/docUtil");
const categories = require("../config/uploadCategories");

/**
 * Save file
 * @param {Object} file
 * @param {string} category
 * @param {string} owner
 * @param {string} createdBy
 * @returns {Promise<Upload>}
 */
const saveFile = async (file, category, owner, createdBy) => {

  const user = await userService.getUserById(owner);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!categories.includes(category)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid category");
  }

  const upload = await uploadFile(file, category);
  const uploadDoc = await Upload.create({
    owner,
    category,
    createdBy,
    public_id: upload.public_id,
    docURL: upload.url,
  });

  return uploadDoc;
};

/**
 * Save and replace file
 * @param {Object} file
 * @param {string} category
 * @param {string} owner
 * @param {string} createdBy
 * @returns {Promise<Upload>}
 */
const saveAndReplace = async (file, category, owner, createdBy) => {
  const user = await userService.getUserById(owner);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!categories.includes(category)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid category");
  }

  const existingUpload = await Upload.findOne({ owner, category });
  if (existingUpload) {
    await deleteFiles([existingUpload.public_id]);
    // Upload.findByIdAndDelete(existingUpload._id);
    await Upload.deleteOne({ _id: existingUpload._id });
  }

  const upload = await uploadFile(file, category);
  const uploadDoc = await Upload.create({
    owner,
    category,
    createdBy,
    public_id: upload.public_id,
    docURL: upload.url,
  });

  return uploadDoc;
};

/**
 * Get files by owner
 * @param {string} owner
 * @returns {Promise<Upload>}
 */
const getFilesByOwner = async (owner) => {
  const user = await userService.getUserById(owner);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const uploads = await Upload.find({ owner });
  return uploads;
};

/**
 * Get files by owner and category
 * @param {string} owner
 * @param {string} category
 * @returns {Promise<Upload>}
 */
const getFilesByOwnerAndCategory = async (owner, category) => {
  const user = await userService.getUserById(owner);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!categories.includes(category)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid category");
  }

  const uploads = await Upload.find({ owner, category });
  return uploads;
};

/**
 * Delete file
 * @param {string} owner
 * @param {string} publicId
 * @returns {Promise}
 */
const deleteUpload = async (owner, uploadId) => {

  const user = await userService.getUserById(owner);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const upload = await Upload.findOne({ owner, _id: uploadId });
  if (!upload) {
    throw new ApiError(httpStatus.NOT_FOUND, "File not found");
  }

  await deleteFiles([upload.public_id]);
  await Upload.deleteOne({ owner, _id: uploadId });
};

/**
 * Delete multiple files
 * @param {string} owner,
 * @param {string} category
 * @returns {Promise}
 */
const deleteMultipleFiles = async (owner, category) => {

  const user = await userService.getUserById(owner);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!categories.includes(category)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid category");
  }

  const uploads = await Upload.find({ owner, category });
  const publicIds = uploads.map((upload) => upload.public_id);

  await deleteFiles(publicIds);
  await Upload.deleteMany({ owner });
};

module.exports = {
  saveFile,
  saveAndReplace,
  getFilesByOwner,
  getFilesByOwnerAndCategory,
  deleteUpload,
  deleteMultipleFiles,
};
