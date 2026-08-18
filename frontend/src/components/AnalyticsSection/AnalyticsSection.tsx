import styles from "./AnalyticsSection.module.css";

import BalanceChart, {
  type BalanceData,
} from "../BalanceChart/BalanceChart";
import RecentActivity from "../RecentActivity/RecentActivity";
import type { Transaction } from "../../types/Transaction";

interface Props {
  balanceData: BalanceData[];
  incomeTotal: number;
  expenseTotal: number;
  balance: number;
  insight: string;
  transactions: Transaction[];
  formatCurrency: (value: number) => string;
  formatDate: (date: string) => string;
}

export default function AnalyticsSection({
  balanceData,
  incomeTotal,
  expenseTotal,
  balance,
  insight,
  transactions,
  formatCurrency,
  formatDate,
}: Props) {
  return (
    <section className={styles.container}>
      <div className={styles.chart}>
        <BalanceChart
          balanceData={balanceData}
          incomeTotal={incomeTotal}
          expenseTotal={expenseTotal}
          balance={balance}
        />

        <div className={styles.insight}>
          <h3>Resumen del mes</h3>
          <p>{insight}</p>
        </div>
      </div>

      <div className={styles.activity}>
        <RecentActivity
          transactions={transactions}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      </div>
    </section>
  );
}
