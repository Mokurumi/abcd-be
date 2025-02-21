import type { Document, Model, Schema, ObjectId } from "mongoose";

/**
 * Role interfaces
 */
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
    paginate(filter: any, options: QueryOptions): Promise<QueryResult<IRole>>;
    toJSON(): any;
  }
}

export {};
