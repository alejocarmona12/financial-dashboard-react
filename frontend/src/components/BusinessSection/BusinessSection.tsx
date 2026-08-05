import styles from "./BusinessSection.module.css";
import BusinessAssistant from "../BusinessAssistant/BusinessAssistant";
import BusinessStatus from "../BusinessStatus/BusinessStatus";

interface Props {
  balance: number;
  ingresos: number;
  gastos: number;
}

export default function BusinessSection({
  balance,
  ingresos,
  gastos,
}: Props) {
  return (
    <section className={styles.container}>
      <BusinessAssistant
        balance={balance}
        ingresos={ingresos}
        gastos={gastos}
      />

      <BusinessStatus
        facturasPendientes={8}
        ordenesPendientes={3}
        combustibleMes={450000}
        cobradoMes={1250000}
      />
    </section>
  );
}