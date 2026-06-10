import type { Document, Model, ObjectId } from "mongoose";

declare global {
  interface IUpload extends Document {
    owner: ObjectId;
    label: string;
    type: "document" | "image" | "video" | "other";
    docURL: string;
    public_id: string;
    category: string;
    createdBy: ObjectId;
    createdAt?: Date | string | number | null;
    updatedAt?: Date | string | number | null;
  }

  interface UploadFilter {
    owner?: ObjectId | string;
    category?: string;
    type?: "document" | "image" | "video" | "other";
    createdBy?: ObjectId | string;
  }

  interface UploadModel extends Model<IUpload> {
    paginate(
      filter: UploadFilter,
      options: QueryOptions
    ): Promise<QueryResult<IUpload>>;
    toJSON(): any;
  }

  interface UploadRequest {
    file: any;
    label: string;
    type: "document" | "image" | "video" | "other";
    category: string;
    owner: string | ObjectId | undefined;
  }
}

export {};
