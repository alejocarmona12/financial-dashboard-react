import { useEffect, useState } from "react";
import api from "../services/Api";

export interface Transaction {
  _id?: string;
  id?: number;

  title?: string;
  description?: string;

  amount: number;

  type: "income" | "expense";

  category: string;

  date?: string;

  hasIVA?: boolean;
}

export const useTransactions = () => {
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  // GET TRANSACTIONS
  const getTransactions = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await api.get(
        "/transactions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTransactions(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // CREATE TRANSACTION
  const addTransaction = async (
    transaction: Transaction
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await api.post(
        "/transactions",
        transaction,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTransactions((prev) => [
        response.data,
        ...prev,
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  // DELETE TRANSACTION
  const deleteTransaction = async (
    id: string
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      await api.delete(
        `/transactions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTransactions((prev) =>
        prev.filter((t) => t._id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);

  return {
    transactions,
    addTransaction,
    deleteTransaction,
  };
};

export const useDashboardCalculations = (
  transactions: Transaction[],
  selectedMonth: string
) => {
  const filteredTransactions =
    selectedMonth === "all"
      ? transactions
      : transactions.filter((t) => {
          if (!t.date) return false;
          return new Date(t.date).getMonth().toString() === selectedMonth;
        });

  const incomeTotal = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseTotal = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = incomeTotal - expenseTotal;

  const ivaTotal = filteredTransactions
    .filter((t) => t.hasIVA)
    .reduce((sum, t) => sum + t.amount * 0.21, 0);

  const expenseByCategory = Object.entries(
    filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce<Record<string, number>>((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {})
  ).map(([name, value]) => ({ name, value }));

  const balanceData = [
    { name: "Ingresos", value: incomeTotal },
    { name: "Gastos", value: expenseTotal },
  ];

  const insight =
    incomeTotal >= expenseTotal
      ? "Buen trabajo manteniendo tus ingresos por encima de los gastos."
      : "Atención: los gastos superan los ingresos.";

  return {
    filteredTransactions,
    incomeTotal,
    expenseTotal,
    balance,
    ivaTotal,
    insight,
    balanceData,
    expenseByCategory,
  };
};
