import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "../hooks/useTransactions";
import { useDashboardCalculations } from "../hooks/useDashboardCalculations";
import "./Dashboard.css";
import ProyectoEndesarrollo from "./Proyecto-en-desarrolo";

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/");
  };

  // FORM
  const [type, setType] = useState<"income" | "expense">("income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [hasIVA, setHasIVA] = useState(false);

  // FILTRO
  const [selectedMonth, setSelectedMonth] = useState("all");

  // DATA
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

  const handleAdd = () => {
    if (!amount || !category || Number(amount) <= 0) return;

    addTransaction({
      id: Date.now(),
      type,
      amount: Number(amount),
      category,
      description,
      date: new Date().toISOString(),
      hasIVA,
    });

    setAmount("");
    setCategory("");
    setDescription("");
    setHasIVA(false);
  };

  const COLORS = ["#16a34a", "#dc2626", "#2563eb", "#0ea5e9"];

  return (
    <>
      <ProyectoEndesarrollo />

      <div className="dashboard">
        {/* HEADER */}
        <div className="header">
          <h2>Sistema de Contabilidad</h2>
          <div className="actions">
            <button className="logout" onClick={logout}>
              Cerrar sesión
            </button>
            <button onClick={() => navigate("/facturas")}>Ver Facturas</button>
          </div>
        </div>

        {/* FILTRO MES */}
        <div className="month-selector">
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
        <div className="form">
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

          <label className="iva-checkbox">
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
        <div className="balance">
          <div className="card income">
            <h3>Ingresos</h3>
            <p>{formatCurrency(incomeTotal)}</p>
          </div>

          <div className="card expense">
            <h3>Gastos</h3>
            <p>{formatCurrency(expenseTotal)}</p>
          </div>

          <div className="card balance-card">
            <h3>Balance</h3>
            <p>{formatCurrency(balance)}</p>
          </div>

          <div className="card iva">
            <h3>IVA</h3>
            <p>{formatCurrency(ivaTotal)}</p>
          </div>
        </div>

        <p className="insight">{insight}</p>

        {/* GRÁFICOS */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}
        >
          <PieChart width={400} height={400}>
            <Pie data={expenseByCategory} dataKey="value" label>
              {expenseByCategory.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>

          <PieChart width={300} height={300}>
            <Pie data={balanceData} dataKey="value" label>
              {balanceData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* TABLA */}
        <table>
          <thead>
            <tr>
              <th>Categoría</th>
              <th>Monto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((t) => (
              <tr key={t.id}>
                <td>{t.category}</td>
                <td>{formatCurrency(t.amount)}</td>
                <td>
                  <button
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
