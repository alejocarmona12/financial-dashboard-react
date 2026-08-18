import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

import type { Transaction } from "../../types/Transaction";
import styles from "./RecentActivity.module.css";

interface Props {
  transactions: Transaction[];
  formatCurrency: (value: number) => string;
  formatDate: (date: string) => string;
}

export default function RecentActivity({
  transactions,
  formatCurrency,
  formatDate,
}: Props) {
  const recentTransactions = transactions.slice(0, 4);

  return (
    <section className={styles.container}>
      <div className={styles.heading}>
        <div>
          <span>Últimos registros</span>
          <h2>Actividad reciente</h2>
        </div>
        <span className={styles.count}>{recentTransactions.length}</span>
      </div>

      {recentTransactions.length === 0 ? (
        <p className={styles.empty}>No hay movimientos para este período.</p>
      ) : (
        <div className={styles.list}>
          {recentTransactions.map((transaction) => {
            const isIncome = transaction.type === "income";

            return (
              <article
                key={transaction._id ?? `${transaction.title}-${transaction.date}`}
                className={styles.item}
              >
                <div className={isIncome ? styles.incomeIcon : styles.expenseIcon}>
                  {isIncome ? <ArrowUpCircle size={18} /> : <ArrowDownCircle size={18} />}
                </div>

                <div className={styles.info}>
                  <strong>{transaction.title}</strong>
                  <span>{transaction.category} · {formatDate(transaction.date)}</span>
                </div>

                <strong className={isIncome ? styles.incomeAmount : styles.expenseAmount}>
                  {isIncome ? "+" : "−"}{formatCurrency(transaction.amount)}
                </strong>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
