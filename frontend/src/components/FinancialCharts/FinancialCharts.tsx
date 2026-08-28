import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FinancialRecord } from "../../types/FinancialRecord";
import styles from "./FinancialCharts.module.css";

const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const colors = ["#3156c9", "#e7a720", "#e35d6a", "#1ca76f", "#7c5ce0", "#3c98c9"];

const money = (value: number) =>
  value.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

interface Props {
  records: FinancialRecord[];
}

export default function FinancialCharts({ records }: Props) {
  const currentYear = new Date().getFullYear().toString();
  const yearRecords = records.filter((record) => record.date.slice(0, 4) === currentYear);
  const monthly = monthNames.map((name, index) => {
    const month = String(index + 1).padStart(2, "0");
    const monthRecords = yearRecords.filter((record) => record.date.slice(5, 7) === month);
    const ingresos = monthRecords.filter((record) => record.type === "income").reduce((total, record) => total + record.amount, 0);
    const gastos = monthRecords.filter((record) => record.type === "expense").reduce((total, record) => total + record.amount, 0);
    return { name, ingresos, gastos, balance: ingresos - gastos };
  });
  const expensesByCategory = Object.entries(
    yearRecords
      .filter((record) => record.type === "expense")
      .reduce<Record<string, number>>((totals, record) => {
        totals[record.category] = (totals[record.category] ?? 0) + record.amount;
        return totals;
      }, {})
  ).map(([name, value]) => ({ name, value }));

  if (records.length === 0) {
    return <section className={styles.empty}>Todavía no hay movimientos para generar estadísticas.</section>;
  }

  return (
    <section className={styles.grid}>
      <article className={`${styles.card} ${styles.wide}`}>
        <div className={styles.heading}><div><span>Visión anual</span><h2>Evolución del balance</h2></div></div>
        <div className={styles.chart}><ResponsiveContainer width="100%" height="100%"><LineChart data={monthly}><XAxis dataKey="name" tickLine={false} axisLine={false} /><YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} tickLine={false} axisLine={false} /><Tooltip formatter={(value) => money(Number(value))} /><Line type="monotone" dataKey="balance" name="Balance" stroke="#3156c9" strokeWidth={3} dot={false} /></LineChart></ResponsiveContainer></div>
      </article>
      <article className={styles.card}>
        <div className={styles.heading}><div><span>Comparativo</span><h2>Ingresos vs gastos</h2></div></div>
        <div className={styles.chart}><ResponsiveContainer width="100%" height="100%"><BarChart data={monthly}><XAxis dataKey="name" tickLine={false} axisLine={false} /><YAxis hide /><Tooltip formatter={(value) => money(Number(value))} /><Legend /><Bar dataKey="ingresos" name="Ingresos" fill="#1ca76f" radius={[4, 4, 0, 0]} /><Bar dataKey="gastos" name="Gastos" fill="#e35d6a" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
      </article>
      <article className={styles.card}>
        <div className={styles.heading}><div><span>Costos</span><h2>Distribución de gastos</h2></div></div>
        <div className={styles.chart}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={expensesByCategory} dataKey="value" nameKey="name" innerRadius={58} outerRadius={85} paddingAngle={3}>{expensesByCategory.map((item, index) => <Cell key={item.name} fill={colors[index % colors.length]} />)}</Pie><Tooltip formatter={(value) => money(Number(value))} /><Legend /></PieChart></ResponsiveContainer></div>
      </article>
    </section>
  );
}
