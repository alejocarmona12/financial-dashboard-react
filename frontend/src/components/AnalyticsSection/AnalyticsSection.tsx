import styles from "./AnalyticsSection.module.css";

import BalanceChart from "../BalanceChart/BalanceChart";
import RecentActivity from "../RecentActivity/RecentActivity";

interface Props {
  balanceData: any;
  incomeTotal: number;
  expenseTotal: number;
  balance: number;
  insight: string;
}

export default function AnalyticsSection({
  balanceData,
  incomeTotal,
  expenseTotal,
  balance,
  insight,
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
        <RecentActivity />
      </div>
    </section>
  );
}