import { Types } from "mongoose";

export type IPlaidItem = {
  _id: Types.ObjectId;
  user: string;

  access_token: string;
  item_id: string;

  institution_id?: string;
  institution_name?: string;

  createdAt: Date;
  updatedAt: Date;
};

export type IBankAccount = {
  _id: Types.ObjectId;

  user: string;
  plaidItem: Types.ObjectId;

  account_id: string; // Plaid account_id (unique per item)

  name: string;
  official_name?: string;

  type: "depository" | "credit" | "loan" | "investment" | "other";
  subtype?: string;

  mask?: string;
  holder_category?: string;

  balances: {
    available?: number;
    current: number;
    limit?: number;
    iso_currency_code: string;
  };

  is_active: boolean;

  is_default_payout: boolean;

  verification_status: "pending" | "verified" | "failed";

  last_verified_at?: Date;

  createdAt: Date;
  updatedAt: Date;
};

export type IBankAccountNumber = {
  _id: Types.ObjectId;

  account: Types.ObjectId;

  encrypted_account_number: string;
  encrypted_routing_number: string;
  encrypted_wire_routing?: string;

  scheme: "ach" | "wire" | "eft" | "bacs" | "international";

  is_tokenized_account_number: boolean;
};
