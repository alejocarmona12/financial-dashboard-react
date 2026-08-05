import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Transaction } from "../types/Transaction";

import {
  obtenerTransacciones,
  crearTransaccion,
  eliminarTransaccion,
} from "../services/TransactionService";

import { useDashboardCalculations } from "../hooks/useDashboardCalculations";

import styles from "./Dashboard.module.css";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import SummaryCards from "../components/Dashboard/SummaryCards/SummaryCards";
import ModalNuevaTransaccion from "../components/ModalNuevaTransaccion/ModalNuevaTransaccion";
import AnalyticsSection from "../components/AnalyticsSection/AnalyticsSection";
import BusinessSection from "../components/BusinessSection/BusinessSection";
import ActionsSection from "../components/ActionsSection/ActionsSection";
import TransactionsSection from "../components/Dashboard/TransactionsSection/TransactionsSection";



export default function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const [selectedMonth, setSelectedMonth] = useState("all");
  const [openModal, setOpenModal] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
const [loading, setLoading] = useState(false);

const cargarTransacciones = async () => {
  try {
    setLoading(true);

    const data = await obtenerTransacciones();

    setTransactions(data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  cargarTransacciones();
}, []);


const guardarTransaccion = async (
  nueva: Transaction
) => {
  try {
    await crearTransaccion(nueva);

    await cargarTransacciones();

    setOpenModal(false);
  } catch (error) {
    console.error(error);
  }
};

const handleEliminar = async (
  id: string
) => {
  try {
    await eliminarTransaccion(id);

    await cargarTransacciones();
  } catch (error) {
    console.error(error);
  }
};

  const {
    filteredTransactions,
    incomeTotal,
    expenseTotal,
    balance,
    ivaTotal,
    insight,
    balanceData,
  } = useDashboardCalculations(transactions, selectedMonth);

  const formatCurrency = (value: number) =>
    value.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
    });

  const formatDate = (dateString: string) => {
    const date = dateString ? new Date(dateString) : new Date();

    if (isNaN(date.getTime())) return "S/D";

    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className={styles.dashboard}>
      {/* HEADER */}
      <div className={styles.topBar}>
        <DashboardHeader titulo="Gestor Contable" />

        <button
          className={styles.logout}
          onClick={logout}
        >
          Cerrar sesión
        </button>
      </div>

   

        {/* TARJETAS */}
        <SummaryCards
        ingresos={incomeTotal}
        gastos={expenseTotal}
        balance={balance}
        iva={ivaTotal}
      />
     
      {/* FILTRO */}
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

      {/* CONTENIDO */}
      <AnalyticsSection
        balanceData={balanceData}
        incomeTotal={incomeTotal}
        expenseTotal={expenseTotal}
        balance={balance}
        insight={insight}
      />
      <BusinessSection
  balance={balance}
  ingresos={incomeTotal}
  gastos={expenseTotal}
/>

<ActionsSection
  onNuevoMovimiento={() => setOpenModal(true)}
/>

      {/* TABLA */}
      <TransactionsSection
  transactions={filteredTransactions}
  onDelete={handleEliminar}
  formatCurrency={formatCurrency}
  formatDate={formatDate}
/>

      {/* MODAL */}
      {openModal && (
  <ModalNuevaTransaccion
  onClose={() => setOpenModal(false)}
  onSave={guardarTransaccion}
/>
)}
    </div>
  );
}