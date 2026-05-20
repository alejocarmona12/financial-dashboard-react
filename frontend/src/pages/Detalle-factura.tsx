import { useNavigate } from "react-router-dom";
import "./Detalle-Facturas.css";

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

  const transactions: Transaction[] = JSON.parse(
    localStorage.getItem("transactions") || "[]",
  );

  const facturas = transactions.filter((t) => t.type === "income" && t.hasIVA);

  return (
    <div className="detalle">
      <h2>🧾 Detalle de Facturas</h2>

      {facturas.length === 0 ? (
        <p>No hay facturas registradas.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Categoría</th>
              <th>Descripción</th>
              <th>Monto</th>
              <th>IVA</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((f) => {
              const iva = f.amount * 0.21;
              return (
                <tr key={f.id}>
                  <td>{new Date(f.date).toLocaleDateString()}</td>
                  <td>{f.category}</td>
                  <td>{f.description}</td>
                  <td>${f.amount.toFixed(2)}</td>
                  <td>${iva.toFixed(2)}</td>
                  <td>${(f.amount + iva).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <button onClick={() => navigate("/dashboard")}>
        Volver al Dashboard
      </button>
    </div>
  );
}
