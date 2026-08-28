export interface Transaction {
  _id?: string;

  title: string;

  amount: number;

  type: "income" | "expense";

  category: string;

  description: string;

  date: string;

  hasIVA: boolean;

  sourceType?: "manual" | "orden" | "combustible";
}

export type NewTransaction = Omit<Transaction, "_id">;
