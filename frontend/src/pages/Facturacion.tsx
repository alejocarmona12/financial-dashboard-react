import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Facturacion.module.css";
import { obtenerTransacciones } from "../services/TransactionService";
import type { Transaction } from "../types/Transaction";

export default function Facturacion() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarFacturacion = async () => {
      try {
        setError("");
        setTransactions(await obtenerTransacciones());
      } catch (requestError) {
        console.error(requestError);
        setError("No se pudo cargar la facturación.");
      } finally {
        setLoading(false);
      }
    };

    cargarFacturacion();
  }, []);

  const ingresos = transactions.filter((transaction) => transaction.type === "income");
  const totalFacturado = ingresos.reduce((total, transaction) => total + transaction.amount, 0);
  const ivaTotal = ingresos
    .filter((transaction) => transaction.hasIVA)
    .reduce((total, transaction) => total + transaction.amount * 0.21, 0);
  const neto = totalFacturado - ivaTotal;
  const formatCurrency = (amount: number) =>
    amount.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

  return (
    <div className={styles.facturacion}>
      <h2>Facturación e IVA</h2>

      {loading ? (
        <p>Cargando facturación...</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : (
        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>Total Facturado</h3>
            <p className={styles.textSuccess}>{formatCurrency(totalFacturado)}</p>
          </div>
          <div className={styles.card}>
            <h3>IVA Estimado</h3>
            <p className={styles.textDanger}>{formatCurrency(ivaTotal)}</p>
          </div>
          <div className={styles.card}>
            <h3>Monto Neto</h3>
            <p className={styles.textInfo}>{formatCurrency(neto)}</p>
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <button className={styles.btnSecondary} onClick={() => navigate("/dashboard")}>
          Volver al Dashboard
        </button>
        <button className={styles.btnPrimary} onClick={() => navigate("/facturas")}>
          Ver Detalle de Facturas
        </button>
      </div>
    </div>
  );
}
