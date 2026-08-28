import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from "recharts";
  
  import styles from "./BalanceChart.module.css";
  
  export interface BalanceData {
    name: string;
    value: number;
    [key: string]: string | number;
  }
  
  interface Props {
    balanceData: BalanceData[];
    incomeTotal: number;
    expenseTotal: number;
    balance: number;
  }
  
  const COLORS = [
    "#22c55e",
    "#ef4444",
    "#3b82f6",
  ];
  
  const formatCurrency = (value: number) =>
    value.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
    });
  
  export default function BalanceChart({
    balanceData,
    incomeTotal,
    expenseTotal,
    balance,
  }: Props) {
    return (
      <div className={styles.chartCard}>
        <h2>Balance General</h2>
  
        <div className={styles.content}>
          {/* Gráfico */}
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={balanceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={false}
                  labelLine={false}
                >
                  {balanceData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
  
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid rgba(77, 98, 137, .16)",
                    borderRadius: 10,
                    boxShadow: "0 12px 24px rgba(30, 51, 87, .12)",
                  }}
                />
  
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
  
          {/* Resumen */}
          <div className={styles.stats}>
  
            <div className={styles.stat}>
              <span>Ingresos</span>
  
              <strong className={styles.income}>
                {formatCurrency(incomeTotal)}
              </strong>
            </div>
  
            <div className={styles.stat}>
              <span>Gastos</span>
  
              <strong className={styles.expense}>
                {formatCurrency(expenseTotal)}
              </strong>
            </div>
  
            <div className={styles.stat}>
              <span>Balance</span>
  
              <strong className={styles.balance}>
                {formatCurrency(balance)}
              </strong>
            </div>
  
          </div>
        </div>
      </div>
    );
  }
