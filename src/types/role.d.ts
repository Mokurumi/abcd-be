import type { Document, Model, Schema, ObjectId } from "mongoose";

/**
 * Role interfaces
 */
declare global {
  type permissionType =
    // Roles
    | "ROLES"
    | "ROLES.CREATE_ROLE"
    | "ROLES.READ_ROLE"
    | "ROLES.UPDATE_ROLE"
    | "ROLES.DELETE_ROLE"
    // Users
    | "USERS"
    | "USERS.CREATE_USER"
    | "USERS.READ_ALL_USERS"
    | "USERS.UPDATE_ALL_USERS"
    | "USERS.DELETE_USER"
    // Others
    | "ANY_WITH_AUTH";

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
  }
}

export {};
