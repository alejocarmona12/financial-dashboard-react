import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Detalle-Facturas.module.css";
import { obtenerTransacciones } from "../services/TransactionService";
import type { Transaction } from "../types/Transaction";

export default function DetalleFacturas() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarFacturas = async () => {
      try {
        setTransactions(await obtenerTransacciones());
      } catch (requestError) {
        console.error(requestError);
        setError("No se pudo cargar el detalle de facturas.");
      } finally {
        setLoading(false);
      }
    };

    cargarFacturas();
  }, []);

  const facturas = transactions.filter(
    (transaction) => transaction.type === "income" && transaction.hasIVA
  );
  const formatCurrency = (amount: number) =>
    amount.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
  const formatDate = (date: string) => {
    const parsedDate = new Date(date);
    return Number.isNaN(parsedDate.getTime())
      ? "S/D"
      : parsedDate.toLocaleDateString("es-AR");
  };

  return (
    <div className={styles.detalle}>
      <h2>🧾 Detalle de Facturas</h2>

      {loading ? (
        <p className={styles.noData}>Cargando facturas...</p>
      ) : error ? (
        <p className={styles.noData} role="alert">{error}</p>
      ) : facturas.length === 0 ? (
        <p className={styles.noData}>No hay facturas registradas.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Categoría</th>
              <th>Descripción</th>
              <th>Monto</th>
              <th>IVA (21%)</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((factura) => {
              const iva = factura.amount * 0.21;
              return (
                <tr key={factura._id ?? `${factura.title}-${factura.date}`}>
                  <td>{formatDate(factura.date)}</td>
                  <td>{factura.category}</td>
                  <td>{factura.description || "Sin descripción"}</td>
                  <td>{formatCurrency(factura.amount)}</td>
                  <td style={{ color: "var(--danger)", fontWeight: 600 }}>
                    {formatCurrency(iva)}
                  </td>
                  <td style={{ color: "var(--success)", fontWeight: 700 }}>
                    {formatCurrency(factura.amount + iva)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <button className={styles.button} onClick={() => navigate("/dashboard")}>
        Volver al Dashboard
      </button>
    </div>
  );
}
