const ApiError = require("../utils/ApiError");
const { Upload } = require("../models");
const { uploadFile, deleteFiles } = require("../utils/docUtil");
const categories = require("../constants/uploadCategories");

/**
 * Save file
 * @param {Object} file
 * @param {string} category
 * @param {string} owner
 * @param {string} createdBy
 * @returns {Promise<Upload>}
 */
const saveFile = async (file, category, owner, createdBy) => {

  if (!categories.includes(category)) {
    throw new ApiError(400, "Invalid category");
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

  if (!categories.includes(category)) {
    throw new ApiError(400, "Invalid category");
  }

  const existingUpload = await Upload.findOne({ owner, category });
  if (existingUpload) {
    // delete from cloudinary
    await deleteFiles([existingUpload.public_id]);
    // delete from db
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
  const uploads = await Upload.find({ owner });
  return uploads;
};

/**
 * Get files by owner and category
 * @param {string} owner
 * @param {string} category
 * @returns {Promise<Upload>}
 */
const getFilesByOwnerAndCategory = async (owner, category) => { //DEPT_FILES
  if (!categories.includes(category)) {
    throw new ApiError(400, "Invalid category");
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

  const upload = await Upload.findOne({ owner, _id: uploadId });
  if (!upload) {
    throw new ApiError(404, "File not found");
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

  if (!categories.includes(category)) {
    throw new ApiError(400, "Invalid category");
  }

  const uploads = await Upload.find({ owner, category });
  const publicIds = uploads.map((upload) => upload.public_id);

  await deleteFiles(publicIds);
  await Upload.deleteMany({ owner, category });
};

module.exports = {
  saveFile,
  saveAndReplace,
  getFilesByOwner,
  getFilesByOwnerAndCategory,
  deleteUpload,
  deleteMultipleFiles,
};
