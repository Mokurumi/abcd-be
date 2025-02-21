import type { Document, Model, Schema, ObjectId } from "mongoose";

/**
 * Upload interfaces
 */
declare global {
  interface IUpload extends Document {
    docURL: string;
    public_id: string;
    category: string;
    owner: ObjectId;
    createdBy: ObjectId;
    createdAt?: Date | string | number | null;
    updatedAt?: Date | string | number | null;
  }

  interface UploadModel extends Model<IUpload> {}
}

export {};
