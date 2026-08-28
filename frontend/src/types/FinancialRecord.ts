export interface FinancialRecord {
  id: string;
  date: string;
  title: string;
  category: string;
  origin: string;
  type: "income" | "expense";
  amount: number;
  hasIVA: boolean;
  status?: string;
}
