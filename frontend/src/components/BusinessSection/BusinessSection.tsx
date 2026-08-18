import styles from "./BusinessSection.module.css";
import BusinessAssistant from "../BusinessAssistant/BusinessAssistant";
import BusinessStatus from "../BusinessStatus/BusinessStatus";

interface Props {
  balance: number;
  ingresos: number;
  gastos: number;
  facturasPendientes: number;
  ordenesPendientes: number;
  combustibleMes: number;
  cobradoMes: number;
}

export default function BusinessSection({
  balance,
  ingresos,
  gastos,
  facturasPendientes,
  ordenesPendientes,
  combustibleMes,
  cobradoMes,
}: Props) {
  return (
    <section className={styles.container}>
      <BusinessAssistant
        balance={balance}
        ingresos={ingresos}
        gastos={gastos}
      />

      <BusinessStatus
        facturasPendientes={facturasPendientes}
        ordenesPendientes={ordenesPendientes}
        combustibleMes={combustibleMes}
        cobradoMes={cobradoMes}
      />
    </section>
  );
}
