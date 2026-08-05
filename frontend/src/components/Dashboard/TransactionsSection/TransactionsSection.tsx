import styles from "./TransactionsSection.module.css";
import type { Transaction } from "../../../types/Transaction";

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  formatCurrency: (value: number) => string;
  formatDate: (date: string) => string;
}

export default function TransactionsSection({
  transactions,
  onDelete,
  formatCurrency,
  formatDate,
}: Props) {
  return (
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
        {transactions.length === 0 ? (
          <tr>
            <td
              colSpan={4}
              style={{
                textAlign: "center",
                padding: "30px",
                color: "var(--text-muted)",
              }}
            >
              No hay movimientos registrados.
            </td>
          </tr>
        ) : (
          transactions.map((t) => (
            <tr key={t._id}>
              <td>{formatDate(t.date)}</td>

              <td>{t.category}</td>

              <td
                style={{
                  fontWeight: 700,
                  color:
                    t.type === "income"
                      ? "var(--success)"
                      : "var(--danger)",
                }}
              >
                {formatCurrency(t.amount)}
              </td>

              <td>
                <button
                  className={styles.deleteButton}
                  onClick={() => {
                    if (t._id) {
                      onDelete(t._id);
                    }
                  }}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}