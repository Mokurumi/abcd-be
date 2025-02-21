import type { Document, Model, Schema, ObjectId } from "mongoose";

/**
 * Token interfaces
 */
declare global {
  interface IToken extends Document {
    token: string;
    user: ObjectId;
    type: string;
    generatedAuthExp?: Date | string | number | null;
    expires: Date | string | number | null;
    blacklisted: boolean;
    createdAt?: Date | string | number | null;
    updatedAt?: Date | string | number | null;
  }

  interface TokenModel extends Model<IToken> {}
}

export {};
