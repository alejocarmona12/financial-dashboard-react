import { useEffect, useState } from "react";

export interface Transaction {
  id: number;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
  hasIVA: boolean;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // cargar desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem("transactions");
    if (saved) setTransactions(JSON.parse(saved));
  }, []);

  const persist = (data: Transaction[]) => {
    setTransactions(data);
    localStorage.setItem("transactions", JSON.stringify(data));
  };

  const addTransaction = (tx: Transaction) => {
    persist([...transactions, tx]);
  };

  const deleteTransaction = (id: number) => {
    if (!confirm("¿Seguro que querés eliminar este movimiento?")) return;
    persist(transactions.filter((t) => t.id !== id));
  };

  return {
    transactions,
    addTransaction,
    deleteTransaction,
  };
}