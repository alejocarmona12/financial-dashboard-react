import type { Transaction } from "./useTransactions";

type ChartData = {
  name: string;
  value: number;
};

export function useDashboardCalculations(
  transactions: Transaction[],
  selectedMonth: string
) {
  const filteredTransactions =
    selectedMonth === "all"
      ? transactions
      : transactions.filter(
          (t) =>
            (new Date(t.date).getMonth() + 1).toString() === selectedMonth
        );

  const incomeTotal = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expenseTotal = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = incomeTotal - expenseTotal;

  const ivaTotal = filteredTransactions
    .filter((t) => t.type === "income" && t.hasIVA)
    .reduce((acc, t) => acc + t.amount * 0.21, 0);

  const insight =
    balance < 0
      ? "⚠️ Estás gastando más de lo que ingresás"
      : balance > 0
      ? "✅ Buen mes, tenés margen positivo"
      : "➖ Estás en equilibrio";

  const balanceData: ChartData[] = [
    { name: "Ingresos", value: incomeTotal },
    { name: "Gastos", value: expenseTotal },
  ];

  const expenseByCategory: ChartData[] = Object.values(
    filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce<Record<string, ChartData>>((acc, t) => {
        if (!acc[t.category]) {
          acc[t.category] = { name: t.category, value: 0 };
        }
        acc[t.category].value += t.amount;
        return acc;
      }, {})
  );

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
}
