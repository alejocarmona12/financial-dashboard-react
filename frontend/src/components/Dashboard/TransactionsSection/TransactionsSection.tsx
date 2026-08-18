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
    <section className={styles.card}>
      <div className={styles.heading}>
        <div>
          <span>Registro financiero</span>
          <h2>Movimientos recientes</h2>
        </div>
        <span className={styles.count}>{transactions.length}</span>
      </div>

      <div className={styles.tableContainer}>
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
                <td colSpan={4} className={styles.empty}>
                  No hay movimientos registrados para este período.
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t._id}>
                  <td>{formatDate(t.date)}</td>
                  <td>{t.category}</td>
                  <td className={t.type === "income" ? styles.income : styles.expense}>
                    {t.type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
                  </td>
                  <td>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      aria-label={`Eliminar ${t.title}`}
                      onClick={() => {
                        if (t._id) onDelete(t._id);
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
      </div>
    </section>
  );
}
