export {};
import type { Document, Model, Schema } from "mongoose";

declare global {
  interface IRole extends Document {
    name: string;
    value?: string;
    active: boolean;
    permissions: string[];
    protected?: boolean;
    createdAt: Date;
    updatedAt?: Date;
  }

  interface RoleModel extends Model<IRole> {
    paginate(
      filter: any,
      options: any
    ): Promise<{
      docs: IRole[];
      totalDocs: number;
      limit: number;
      page: number;
      totalPages: number;
      nextPage?: number;
      prevPage?: number;
    }>;

    toJSON(): any;
  }

  interface IUser extends Document {
    firstName: string;
    lastName: string;
    middleName?: string | null;
    emailAddress: string;
    phoneNumber: string;
    profile_img?: string | null;
    password: string;
    role?: Schema.Types.ObjectId | IRole | string | null | undefined;
    isPhoneVerified?: boolean;
    isEmailVerified?: boolean;
    active?: boolean;
    firstTimeLogin?: boolean;
    lastLogin?: Date | string | number | null;
    lastFailedLogin?: Date | string | number | null;
    protected: boolean;
    isDeleted?: boolean;
    deletedAt?: Date | string | number | null;
    createdAt?: Date | string | number | null;
    updatedAt?: Date | string | number | null;
    isPasswordMatch(password: string): Promise<boolean>;
  }

  interface UserModel extends Model<IUser> {
    setPassword(password: string): Promise<void>;

    paginate(
      filter: any,
      options: any
    ): Promise<{
      docs: IUser[];
      totalDocs: number;
      limit: number;
      page: number;
      totalPages: number;
      nextPage?: number;
      prevPage?: number;
    }>;

    toJSON(): any;
  }

  interface IToken extends Document {
    token: string;
    user: Schema.Types.ObjectId;
    type: string;
    generatedAuthExp?: Date | string | number | null;
    expires: Date | string | number | null;
    blacklisted: boolean;
    createdAt?: Date | string | number | null;
    updatedAt?: Date | string | number | null;
  }

  interface TokenModel extends Model<IToken> {}

  interface IUpload extends Document {
    docURL: string;
    public_id: string;
    category: string;
    owner: Schema.Types.ObjectId;
    createdBy: Schema.Types.ObjectId;
    createdAt?: Date | string | number | null;
    updatedAt?: Date | string | number | null;
  }

  interface UploadModel extends Model<IUpload> {
    isUploadExisting(category: string, owner: string): Promise<boolean>;
  }
}
