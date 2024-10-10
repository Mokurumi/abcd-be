const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { Upload } = require("../models");
const userService = require("./user.service");
const { uploadFile, deleteFile } = require("../utils/docUtil");
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

module.exports = {
  saveFile,
  // deleteFile,
  // deleteMultipleFiles,
};
