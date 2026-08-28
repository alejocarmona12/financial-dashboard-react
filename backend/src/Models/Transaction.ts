import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  description?: string;
  date: string;
  hasIVA: boolean;
  sourceType: "manual" | "orden" | "combustible";
  sourceId?: mongoose.Types.ObjectId;
}

const transactionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    date: {
      type: String,
      required: true,
    },

    hasIVA: {
      type: Boolean,
      default: false,
    },

    // Identifica los movimientos creados desde otro módulo para que no se
    // contabilicen otra vez al sumar órdenes o cargas de combustible.
    sourceType: {
      type: String,
      enum: ["manual", "orden", "combustible"],
      default: "manual",
    },

    sourceId: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema
);
