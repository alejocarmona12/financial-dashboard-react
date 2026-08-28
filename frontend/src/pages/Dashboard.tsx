import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import type { NewTransaction, Transaction } from "../types/Transaction";

import {
  obtenerTransacciones,
  crearTransaccion,
  eliminarTransaccion,
} from "../services/TransactionService";
import {
  obtenerResumenDashboard,
  type DashboardSummary,
} from "../services/DashboardService";

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
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [openModal, setOpenModal] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [dashboardSummary, setDashboardSummary] =
    useState<DashboardSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState("");

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

const cargarResumenDashboard = async (month: string) => {
  try {
    setSummaryLoading(true);
    setSummaryError("");

    const data = await obtenerResumenDashboard(month);

    setDashboardSummary(data);
  } catch (error) {
    console.error(error);
    setSummaryError("No se pudo cargar el estado del negocio.");
  } finally {
    setSummaryLoading(false);
  }
};

useEffect(() => {
  cargarTransacciones();
}, []);

useEffect(() => {
  cargarResumenDashboard(selectedMonth);
}, [selectedMonth]);


const guardarTransaccion = async (
  nueva: NewTransaction
) => {
  try {
    await crearTransaccion(nueva);

    await Promise.all([
      cargarTransacciones(),
      cargarResumenDashboard(selectedMonth),
    ]);

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

    await Promise.all([
      cargarTransacciones(),
      cargarResumenDashboard(selectedMonth),
    ]);
  } catch (error) {
    console.error(error);
  }
};

  const {
    filteredTransactions,
    incomeTotal,
    expenseTotal,
    ivaTotal,
  } = useDashboardCalculations(transactions, selectedMonth);

  const ingresos = dashboardSummary?.ingresos ?? incomeTotal;
  const gastos = dashboardSummary?.gastos ?? expenseTotal;
  const balance = dashboardSummary?.balance ?? incomeTotal - expenseTotal;
  const balanceData = [
    { name: "Ingresos", value: ingresos },
    { name: "Gastos", value: gastos },
  ];
  const insight =
    balance >= 0
      ? "Buen trabajo manteniendo tus ingresos por encima de los gastos."
      : "Atención: los gastos superan los ingresos.";

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
      <div className={styles.topBar}>
        <DashboardHeader titulo="Gestor Contable" />

        <div className={styles.topActions}>
          <label className={styles.periodControl}>
            <span>Período</span>
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
          </label>

          <button
            className={styles.newMovement}
            onClick={() => setOpenModal(true)}
          >
            <Plus size={18} />
            Nuevo movimiento
          </button>

        </div>
      </div>

      <SummaryCards
        ingresos={ingresos}
        gastos={gastos}
        balance={balance}
        iva={ivaTotal}
      />

      <AnalyticsSection
        balanceData={balanceData}
        incomeTotal={ingresos}
        expenseTotal={gastos}
        balance={balance}
        insight={insight}
        transactions={filteredTransactions}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />
      {summaryLoading && (
        <p className={styles.loading}>Cargando estado del negocio...</p>
      )}

      {summaryError && (
        <p className={styles.loading} role="alert">
          {summaryError}
        </p>
      )}

      {dashboardSummary && (
        <BusinessSection
          balance={balance}
          ingresos={dashboardSummary.ingresos}
          gastos={dashboardSummary.gastos}
          facturasPendientes={dashboardSummary.facturasPendientes}
          ordenesPendientes={dashboardSummary.ordenesPendientes}
          combustibleMes={dashboardSummary.combustibleMes}
          cobradoMes={dashboardSummary.cobradoMes}
        />
      )}

      <ActionsSection onNuevoMovimiento={() => setOpenModal(true)} />

      {/* TABLA */}
      {loading ? (
        <p className={styles.loading}>Cargando movimientos...</p>
      ) : (
        <TransactionsSection
          transactions={filteredTransactions}
          onDelete={handleEliminar}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      )}

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
