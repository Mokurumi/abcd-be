const cloudinary = require("cloudinary").v2;
const config = require("../config/config");

cloudinary.config({
  cloud_name: config.cloudinary.name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

/**
 * upload doc to cloudinary
 * @param {File} file
 * @param {string} folder
 * @returns {Promise}
 */
const uploadFile = async (file, folder, type) => {
  // generate unique id that is composed of the time and the file name
  const uniqueId = `${new Date().toISOString()}-${file.filename}`;
  // upload file to cloudinary
  const result = await cloudinary.uploader
    .upload(file.path, {
      type: type || "upload",
      public_id: uniqueId,
      resource_type: "auto",
      folder: folder,
    })
    .catch((err) => {
      console.log('uploadFile error', err);
      throw new Error('Document upload failed. Try again later.');
    });

  // optimize the image
  // const optimizedUrl = cloudinary.url(result.public_id, {
  //   quality: "auto",
  //   fetch_format: "auto",
  // });

  return {
    public_id: result.public_id,
    // url: optimizedUrl,
    url: result.secure_url,
  };
};

/**
 * delete doc from cloudinary
 * @param {string} publicId
 * @returns {Promise}
 */
const deleteFile = async (publicId) => {
  // delete file from cloudinary
  await cloudinary.uploader
    .destroy(publicId)
    .catch((err) => {
      console('deleteFile error', err);
      throw new Error('Document delete failed. Try again later.');
    });
};

module.exports = {
  uploadFile,
  deleteFile,
};
