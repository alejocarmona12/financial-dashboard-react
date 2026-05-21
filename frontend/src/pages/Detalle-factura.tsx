import { useNavigate } from "react-router-dom";
import styles from "./Detalle-Facturas.module.css"; // Importación correcta como CSS Module

interface Transaction {
  id: number;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
  hasIVA: boolean;
}

export default function DetalleFacturas() {
  const navigate = useNavigate();

  // 1. CORRECCIÓN SEGURIDAD: Identificar la clave exclusiva del usuario activo
  const authData = localStorage.getItem("auth");
  let storageKey = "transactions_guest";

  if (authData) {
    try {
      const currentUser = JSON.parse(authData);
      if (currentUser && currentUser.email) {
        storageKey = `transactions_${currentUser.email}`;
      }
    } catch (e) {
      console.error("Error al recuperar sesión en detalle de facturas", e);
    }
  }

  // Carga las transacciones del usuario correcto
  const transactions: Transaction[] = JSON.parse(
    localStorage.getItem(storageKey) || "[]",
  );

  // Filtra solo los ingresos que tengan tildada la opción de IVA
  const facturas = transactions.filter((t) => t.type === "income" && t.hasIVA);

  // Funciones auxiliares de formato
  const formatCurrency = (v: number) =>
    v.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

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
    <div className={styles.detalle}>
      <h2>🧾 Detalle de Facturas</h2>

      {facturas.length === 0 ? (
        <p className={styles.noData}>
          No hay facturas registradas para este usuario.
        </p>
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
            {facturas.map((f) => {
              const iva = f.amount * 0.21;
              const total = f.amount + iva;
              return (
                <tr key={f.id}>
                  <td
                    style={{
                      fontFamily: "Courier New, monospace",
                      fontWeight: 600,
                      color: "var(--text-muted)",
                    }}
                  >
                    {formatDate(f.date)}
                  </td>
                  <td>{f.category}</td>
                  <td style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                    {f.description || "Sin descripción"}
                  </td>
                  <td>{formatCurrency(f.amount)}</td>
                  <td style={{ color: "var(--danger)", fontWeight: 600 }}>
                    {formatCurrency(iva)}
                  </td>
                  <td style={{ color: "var(--success)", fontWeight: 700 }}>
                    {formatCurrency(total)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* BOTÓN VOLVER */}
      <button className={styles.button} onClick={() => navigate("/dashboard")}>
        Volver al Dashboard
      </button>
    </div>
  );
}
