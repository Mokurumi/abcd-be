import type { Document, Model, ObjectId } from "mongoose";

declare global {
  interface INotification extends Document {
    user: string | ObjectId;
    title: string;
    message: string;
    category: "general";
    type: "info" | "warning" | "error" | "success";
    viaEmail?: boolean;
    viaSMS?: boolean;
    viaPush?: boolean;
    read: boolean;
    readAt?: Date | string | number;
    isDeleted?: boolean;
    createdAt: Date;
    createdBy?: string | ObjectId;
    updatedAt?: Date;
  }

  interface NotificationModel extends Model<INotification> {
    paginate(
      filter: any,
      options: QueryOptions
    ): Promise<QueryResult<INotification>>;
    toJSON(): any;
  }

  interface NotificationRequest {
    users: (string | undefined)[];
    title: string;
    message: string;
    category: "general";
    type: "info" | "warning" | "error" | "success";
    viaEmail?: boolean;
    viaSMS?: boolean;
    viaPush?: boolean;
  }
}

export {};
