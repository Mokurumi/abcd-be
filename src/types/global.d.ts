import type { Document, Model, Schema, ObjectId } from "mongoose";

declare global {
  interface QueryOptions {
    sortBy?: any;
    populate?:
      | string
      | { path: string; populate?: string; select?: string }[]
      | (string | { path: string; populate?: string })[];
    size?: any;
    page?: any;
  }

  interface QueryResult<T> {
    results: T[];
    page: number;
    size: number;
    totalPages: number;
    totalResults: number;
  }

  interface TxnAmountItem {
    transaction: string | ObjectId | ITransaction;
    amount: number;
  }
}

export {};
