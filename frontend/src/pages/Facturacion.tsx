import { useNavigate } from "react-router-dom";
import styles from "./Facturacion.module.css"; // Importación correcta como CSS Module

interface Transaction {
  id: number;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
  hasIVA: boolean;
}

export default function Facturacion() {
  const navigate = useNavigate();

  // 1. CORRECCIÓN SEGURIDAD: Identificar la clave exclusiva del usuario logueado
  const authData = localStorage.getItem("auth");
  let storageKey = "transactions_guest";

  if (authData) {
    try {
      const currentUser = JSON.parse(authData);
      if (currentUser && currentUser.email) {
        storageKey = `transactions_${currentUser.email}`;
      }
    } catch (e) {
      console.error("Error al recuperar sesión en facturación", e);
    }
  }

  // Carga las transacciones del usuario correcto
  const transactions: Transaction[] = JSON.parse(
    localStorage.getItem(storageKey) || "[]",
  );

  // LÓGICA DE CÁLCULOS
  const ingresos = transactions.filter((t) => t.type === "income");
  const totalFacturado = ingresos.reduce((acc, t) => acc + t.amount, 0);
  const ingresosConIVA = ingresos.filter((t) => t.hasIVA);
  const ivaTotal = ingresosConIVA.reduce((acc, t) => acc + t.amount * 0.21, 0);
  const neto = totalFacturado - ivaTotal;

  return (
    <div className={styles.facturacion}>
      <h2>Facturación e IVA</h2>

      <div className={styles.cards}>
        {/* Tarjeta 1: Total Facturado - Verde Neón */}
        <div className={styles.card}>
          <h3>Total Facturado</h3>
          <p className={styles.textSuccess}>
            {totalFacturado.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          </p>
        </div>

        {/* Tarjeta 2: IVA - Rosa/Fucsia Neón */}
        <div className={styles.card}>
          <h3>IVA Estimado</h3>
          <p className={styles.textDanger}>
            {ivaTotal.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          </p>
        </div>

        {/* Tarjeta 3: Neto - Cyan Neón */}
        <div className={styles.card}>
          <h3>Monto Neto</h3>
          <p className={styles.textInfo}>
            {neto.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          </p>
        </div>
      </div>

      {/* CONTENEDOR DE ACCIONES */}
      <div className={styles.actions}>
        <button
          className={styles.btnSecondary}
          onClick={() => navigate("/dashboard")}
        >
          Volver al Dashboard
        </button>
        <button
          className={styles.btnPrimary}
          onClick={() => navigate("/facturas")}
        >
          Ver Detalle de Facturas
        </button>
      </div>
    </div>
  );
}
