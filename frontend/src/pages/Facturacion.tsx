import { useNavigate } from "react-router-dom";
import "./Facturacion.css";
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

  const transactions: Transaction[] = JSON.parse(
    localStorage.getItem("transactions") || "[]",
  );

  // Solo ingresos
  const ingresos = transactions.filter((t) => t.type === "income");

  // Total facturado (con y sin IVA)
  const totalFacturado = ingresos.reduce((acc, t) => acc + t.amount, 0);

  // Solo ingresos con IVA
  const ingresosConIVA = ingresos.filter((t) => t.hasIVA);

  // IVA real a pagar
  const ivaTotal = ingresosConIVA.reduce((acc, t) => acc + t.amount * 0.21, 0);

  const neto = totalFacturado - ivaTotal;

  return (
    <div className="facturacion">
      <h2>Facturación e IVA</h2>

      <div className="cards">
        <div className="card">
          <h3>Total Facturado</h3>
          <p>${totalFacturado.toFixed(2)}</p>
        </div>

        <div className="card">
          <h3>IVA (solo con factura)</h3>
          <p>${ivaTotal.toFixed(2)}</p>
        </div>

        <div className="card">
          <h3>Neto</h3>
          <p>${neto.toFixed(2)}</p>
        </div>
      </div>

      <button onClick={() => navigate("/dashboard")}>
        Volver al Dashboard
      </button>
      <button onClick={() => navigate("/facturas")}>
        Ver Detalle de Facturas
      </button>
    </div>
  );
}
