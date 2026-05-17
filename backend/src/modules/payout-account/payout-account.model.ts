import { Schema, model } from "mongoose";
import {
  IBankAccount,
  IBankAccountNumber,
  IPlaidItem,
} from "./payout-account.interface";
import { schemaOptions } from "@/utils/schemaOptions";

const PlaidItemSchema = new Schema<IPlaidItem>(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },

    access_token: {
      type: String,
      required: true,
    },

    item_id: {
      type: String,
      required: true,
    },
    institution_id: { type: String, required: true, index: true },
    institution_name: { type: String },
  },
  schemaOptions
);

// Prevent duplicate Plaid item per user
PlaidItemSchema.index({ user: 1, item_id: 1 }, { unique: true });

export const PlaidItemModel = model("PlaidItem", PlaidItemSchema);

const BankAccountSchema = new Schema<IBankAccount>(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },

    plaidItem: {
      type: Schema.Types.ObjectId,
      ref: "PlaidItem",
      required: true,
      index: true,
    },

    account_id: {
      type: String,
      required: true,
    },

    fingerprint: {
      type: String,
      required: true,
    },

    name: String,
    official_name: String,

    type: {
      type: String,
      required: true,
      enum: ["depository", "credit", "loan", "investment", "other"],
      index: true,
    },

    subtype: String,

    mask: String,
    holder_category: String,

    balances: {
      available: Number,
      current: { type: Number, required: true },
      limit: Number,
      iso_currency_code: String,
    },

    is_active: {
      type: Boolean,
      default: true,
      index: true,
    },

    is_default_payout: {
      type: Boolean,
      default: false,
      index: true,
    },

    verification_status: {
      type: String,
      enum: ["pending", "verified", "failed"],
      default: "verified",
      index: true,
    },

    last_verified_at: {
      type: Date,
      default: Date.now,
    },
  },
  schemaOptions
);

BankAccountSchema.index({ plaidItem: 1, account_id: 1 }, { unique: true });

export const BankAccountModel = model("BankAccount", BankAccountSchema);

const BankAccountNumberSchema = new Schema<IBankAccountNumber>(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: "BankAccount",
      required: true,
      index: true,
      unique: true,
    },

    encrypted_account_number: {
      type: String,
      required: true,
      select: false,
    },

    encrypted_routing_number: {
      type: String,
      required: true,
      select: false,
    },

    encrypted_wire_routing: {
      type: String,
      select: false,
    },

    scheme: {
      type: String,
      enum: ["ach", "wire", "eft", "bacs", "international"],
      required: true,
      index: true,
    },

    is_tokenized_account_number: {
      type: Boolean,
      default: false,
    },
  },
  schemaOptions
);

export const BankAccountNumberModel = model(
  "BankAccountNumber",
  BankAccountNumberSchema
);
