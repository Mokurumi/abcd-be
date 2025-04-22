import type { Document, Model, Schema, ObjectId } from "mongoose";

/**
 * User interfaces
 */
declare global {
  interface IUser extends Document {
    firstName: string;
    lastName: string;
    middleName?: string | null;
    emailAddress: string;
    phoneNumber: string;
    profile_img?: string | null;
    password: string;
    role?: ObjectId | IRole | string | null | undefined;
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
    paginate(filter: any, options: QueryOptions): Promise<QueryResult<IUser>>;
  }
}

export {};
