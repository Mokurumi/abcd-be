import mongoose from "mongoose";

import ApiError from "../utils/ApiError";
import { uploadFile, deleteFiles } from "../utils/docUtil";
import { uploadCategories } from "../constants";

import { Upload } from "../models";

const saveFile = async (
  requestBody: UploadRequest,
  createdBy: string | mongoose.ObjectId | undefined
): Promise<IUpload | null> => {
  const { file, category, owner, label, type } = requestBody;

  if (!uploadCategories.includes(category)) {
    throw new ApiError(400, "Invalid category");
  }

  const upload = await uploadFile(file, category);
  return Upload.create({
    owner,
    category,
    label,
    type,
    createdBy,
    public_id: upload.public_id,
    docURL: upload.url,
  });
};

const saveAndReplace = async (
  requestBody: UploadRequest,
  createdBy: string | mongoose.ObjectId | undefined
): Promise<IUpload | null> => {
  const { file, category, owner, label, type } = requestBody;

  if (!uploadCategories.includes(category)) {
    throw new ApiError(400, "Invalid category");
  }

  const upload = await uploadFile(file, category);
  const existingUpload = await Upload.findOne({ owner, category });

  if (existingUpload) {
    await deleteFiles([existingUpload.public_id]);
    existingUpload.docURL = upload.url;
    existingUpload.public_id = upload.public_id;
    existingUpload.label = label;
    existingUpload.type = type;
    await existingUpload.save();
    return existingUpload;
  }

  return Upload.create({
    owner,
    category,
    label,
    type,
    createdBy,
    public_id: upload.public_id,
    docURL: upload.url,
  });
};

const queryUploads = async (
  filter: UploadFilter,
  options?: QueryOptions,
  paginated: boolean = false
) => {
  return paginated && options
    ? Upload.paginate(filter, {
        ...options,
        populate: [{ path: "createdBy", select: "firstName lastName" }],
      })
    : Upload.find(filter);
};

const getFilesByOwner = async (
  owner: string | mongoose.ObjectId | undefined
) => {
  return Upload.find({ owner });
};

const getFilesByOwnerAndCategory = async (
  owner: string | mongoose.ObjectId | undefined,
  category: string
) => {
  if (!uploadCategories.includes(category)) {
    throw new ApiError(400, "Invalid category");
  }
  return Upload.find({ owner, category });
};

const deleteUpload = async (
  owner: string | mongoose.ObjectId | undefined,
  uploadId: string | mongoose.ObjectId | undefined
) => {
  const upload = await Upload.findOne({ owner, _id: uploadId });
  if (!upload) {
    throw new ApiError(404, "File not found");
  }
  await deleteFiles([upload.public_id]);
  await Upload.deleteOne({ owner, _id: uploadId });
};

const deleteMultipleByOwner = async (
  owner: string | mongoose.ObjectId | undefined,
  category: string
) => {
  if (!uploadCategories.includes(category)) {
    throw new ApiError(400, "Invalid category");
  }
  const uploads = await Upload.find({ owner, category });
  if (!uploads || uploads.length === 0) return;
  await deleteFiles(uploads.map((u) => u.public_id));
  await Upload.deleteMany({ owner, category });
};

const deleteMultipleByIds = async (
  ids: string[] | undefined,
  owner: string | undefined
) => {
  if (!ids || ids.length === 0) {
    throw new ApiError(400, "Ids are required");
  }
  const uploads = await Upload.find({ _id: { $in: ids }, owner });
  if (!uploads || uploads.length === 0) {
    throw new ApiError(404, "Files not found");
  }
  await deleteFiles(uploads.map((u) => u.public_id));
  await Upload.deleteMany({ _id: { $in: ids }, owner });
};

export default {
  saveFile,
  saveAndReplace,
  queryUploads,
  getFilesByOwner,
  getFilesByOwnerAndCategory,
  deleteUpload,
  deleteMultipleByOwner,
  deleteMultipleByIds,
};
