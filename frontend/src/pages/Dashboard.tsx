import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "../hooks/useTransactions";
import { useDashboardCalculations } from "../hooks/useDashboardCalculations";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/");
  };

  // FORM STATE
  const [type, setType] = useState<"income" | "expense">("income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [hasIVA, setHasIVA] = useState(false);

  // FILTRO STATE
  const [selectedMonth, setSelectedMonth] = useState("all");

  // DATA HOOKS
  const { transactions, addTransaction, deleteTransaction } = useTransactions();

  const {
    filteredTransactions,
    incomeTotal,
    expenseTotal,
    balance,
    ivaTotal,
    insight,
    balanceData,
    expenseByCategory,
  } = useDashboardCalculations(transactions, selectedMonth);

  const formatCurrency = (v: number) =>
    v.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

  // FUNCIÓN PARA FORMATEAR LA FECHA AUTOMÁTICA CON AJUSTE ROBUSTO
  const formatDate = (dateString: string) => {
    // Si la transacción no tiene fecha (historial viejo), usa la fecha de hoy para asegurar visibilidad
    const date = dateString ? new Date(dateString) : new Date();

    if (isNaN(date.getTime())) return "S/D";

    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleAdd = () => {
    if (!amount || !category || Number(amount) <= 0) return;

    addTransaction({
      id: Date.now(),
      type,
      amount: Number(amount),
      category,
      description,
      date: new Date().toISOString(), // Inyecta la fecha y hora del sistema automáticamente
      hasIVA,
    });

    setAmount("");
    setCategory("");
    setDescription("");
    setHasIVA(false);
  };

  // NUEVA PALETA DE COLORES NEÓN PARA RECHARTS (Matchea las variables globales)
  const COLORS = ["#05ffc3", "#ff007f", "#00f0ff", "#bd00ff"];

  return (
    <>
      <div className={styles.dashboard}>
        {/* HEADER */}
        <div className={styles.header}>
          <h2>Sistema de Contabilidad</h2>
          <div className={styles.actions}>
            <button className={styles.logout} onClick={logout}>
              Cerrar sesión
            </button>
            <button
              className={styles.primary}
              onClick={() => navigate("/facturas")}
            >
              Ver Facturas
            </button>
          </div>
        </div>

        {/* FILTRO MES */}
        <div className={styles.monthSelector}>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="all">Todos los meses</option>
            <option value="0">Enero</option>
            <option value="1">Febrero</option>
            <option value="2">Marzo</option>
            <option value="3">Abril</option>
            <option value="4">Mayo</option>
            <option value="5">Junio</option>
            <option value="6">Julio</option>
            <option value="7">Agosto</option>
            <option value="8">Septiembre</option>
            <option value="9">Octubre</option>
            <option value="10">Noviembre</option>
            <option value="11">Diciembre</option>
          </select>
        </div>

        {/* FORMULARIO */}
        <div className={styles.form}>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "income" | "expense")}
          >
            <option value="income">Ingreso</option>
            <option value="expense">Gasto</option>
          </select>

          <input
            type="number"
            placeholder="Monto"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            placeholder="Categoría"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <input
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label className={styles.ivaCheckbox}>
            <input
              type="checkbox"
              checked={hasIVA}
              onChange={(e) => setHasIVA(e.target.checked)}
            />
            Tiene IVA
          </label>

          <button onClick={handleAdd}>Agregar</button>
        </div>

        {/* TARJETAS */}
        <div className={styles.balance}>
          <div className={`${styles.card} ${styles.income}`}>
            <h3>Ingresos</h3>
            <p>{formatCurrency(incomeTotal)}</p>
          </div>

          <div className={`${styles.card} ${styles.expense}`}>
            <h3>Gastos</h3>
            <p>{formatCurrency(expenseTotal)}</p>
          </div>

          <div className={`${styles.card} ${styles.balanceCard}`}>
            <h3>Balance</h3>
            <p>{formatCurrency(balance)}</p>
          </div>

          <div className={`${styles.card} ${styles.iva}`}>
            <h3>IVA</h3>
            <p>{formatCurrency(ivaTotal)}</p>
          </div>
        </div>

        <p className={styles.insight}>{insight}</p>

        {/* CONTENEDOR DE GRÁFICOS */}
        <div
          className={styles.chartsContainer}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
            margin: "40px 0",
          }}
        >
          {/* GRÁFICO 1: GASTOS POR CATEGORÍA */}
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={false}
                  labelLine={false}
                >
                  {expenseByCategory.map((_, i) => (
                    <Cell
                      key={i}
                      fill={COLORS[i % COLORS.length]}
                      stroke="var(--bg-card)"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#201335",
                    borderColor: "var(--primary)",
                    borderRadius: "8px",
                    color: "var(--text-main)",
                  }}
                  itemStyle={{ color: "#ffffff", fontWeight: "bold" }}
                />
                <Legend
                  formatter={(value) => (
                    <span
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* GRÁFICO 2: BALANCE GENERAL */}
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={balanceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={false}
                  labelLine={false}
                >
                  {balanceData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={COLORS[i % COLORS.length]}
                      stroke="var(--bg-card)"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#201335",
                    borderColor: "var(--primary)",
                    borderRadius: "8px",
                    color: "var(--text-main)",
                  }}
                  itemStyle={{ color: "#ffffff", fontWeight: "bold" }}
                />
                <Legend
                  formatter={(value) => (
                    <span
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TABLA DE MOVIMIENTOS INTEGRADA CON FECHA AUTOMÁTICA */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Categoría</th>
              <th>Monto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((t) => (
              <tr key={t.id}>
                <td
                  style={{
                    fontFamily: "Courier New, monospace",
                    fontWeight: 600,
                    color: "var(--text-muted)",
                  }}
                >
                  {formatDate(t.date || "")}
                </td>
                <td>{t.category}</td>
                <td
                  style={{
                    fontWeight: 700,
                    color:
                      t.type === "income" ? "var(--success)" : "var(--danger)",
                  }}
                >
                  {formatCurrency(t.amount)}
                </td>
                <td>
                  <button
                    className={styles.logout}
                    style={{
                      padding: "6px 12px",
                      fontSize: "14px",
                      marginTop: 0,
                    }}
                    onClick={() => deleteTransaction(Number(t.id ?? t._id))}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
