import type { Document, Model, Schema, ObjectId } from "mongoose";

/**
 * Role interfaces
 */
declare global {
  type permissionType =
    | "ANY_WITH_AUTH"
    | "ROLES"
    | "ROLES.CREATE_ROLE"
    | "ROLES.READ_ROLE"
    | "ROLES.UPDATE_ROLE"
    | "ROLES.DELETE_ROLE"
    | "USERS"
    | "USERS.CREATE_USER"
    | "USERS.READ_USER"
    | "USERS.UPDATE_USER"
    | "USERS.DELETE_USER";

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
