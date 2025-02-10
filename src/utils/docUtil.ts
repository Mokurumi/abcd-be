// const cloudinary = require("cloudinary").v2;
import { v2 as cloudinary } from "cloudinary";
import config from "../config";

interface File {
  originalname: string;
  buffer: Buffer;
}

cloudinary.config({
  cloud_name: config.cloudinary.name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

/**
 * upload doc to cloudinary
 * @param {File} file
 * @param {string} folder
 * @param {string} type
 * @returns {Promise}
 */
const uploadFile = async (
  file: File,
  folder: string,
  type: string = "upload"
): Promise<{ public_id: string; url: string }> => {
  // generate unique id that is composed of the time and the file name
  const uniqueId = `${new Date().toISOString()}-${file.originalname}`;

  const result = await new Promise<any>((resolve) => {
    cloudinary.uploader
      .upload_stream(
        {
          type: type || "upload",
          public_id: uniqueId,
          resource_type: "auto",
          folder: folder,
        },
        (error, result) => {
          return resolve(result);
        }
      )
      .end(file.buffer);
  });

  return {
    public_id: result.public_id,
    url: result.secure_url,
  };
};

/**
 * delete doc from cloudinary
 * @param {string[]} publicIds - The public IDs of the files to delete
 * @returns {Promise}
 */
const deleteFiles = async (publicIds: string[]): Promise<void> => {
  // delete file from cloudinary
  await cloudinary.api.delete_resources(publicIds).catch((err: Error) => {
    console.log("deleteFile error", err);
    throw new Error("Document deletion failed. Try again later.");
  });
};

export { uploadFile, deleteFiles };
