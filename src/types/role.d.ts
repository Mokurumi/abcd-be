import type { Document, Model, Schema, ObjectId } from "mongoose";

/**
 * Role interfaces
 */
declare global {
  type permissionType =
    | "ANY_WITH_AUTH"
    | "ROLE_MANAGEMENT"
    | "ROLE_MANAGEMENT.CREATE_ROLE"
    | "ROLE_MANAGEMENT.READ_ROLE"
    | "ROLE_MANAGEMENT.UPDATE_ROLE"
    | "ROLE_MANAGEMENT.DELETE_ROLE"
    | "USER_MANAGEMENT"
    | "USER_MANAGEMENT.CREATE_USER"
    | "USER_MANAGEMENT.READ_USER"
    | "USER_MANAGEMENT.UPDATE_USER"
    | "USER_MANAGEMENT.DELETE_USER";

  interface IRole extends Document {
    name: string;
    value?: string;
    active: boolean;
    permissions: rolepermission[];
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
