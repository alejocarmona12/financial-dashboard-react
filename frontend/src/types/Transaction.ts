export interface Transaction {
  _id?: string;

  title: string;

  amount: number;

  type: "income" | "expense";

  category: string;

  description: string;

  date: string;

  hasIVA: boolean;
}