import {
    AlertTriangle,
    CheckCircle2,
    TrendingUp,
  } from "lucide-react";
  
  import styles from "./BusinessAssistant.module.css";
  
  interface Props {
    balance: number;
    ingresos: number;
    gastos: number;
  }
  
  export default function BusinessAssistant({
    balance,
    ingresos,
    gastos,
  }: Props) {
    let icon = <CheckCircle2 size={28} />;
    let title = "Todo está funcionando correctamente.";
    let message =
      "El negocio mantiene un balance positivo. Seguí registrando los movimientos para obtener estadísticas más precisas.";
  
    if (balance < 0) {
      icon = <AlertTriangle size={28} />;
      title = "Atención";
      message =
        "Los gastos superan a los ingresos. Revisá los movimientos registrados y controlá los costos.";
    }
  
    if (gastos > ingresos * 0.8 && balance > 0) {
      icon = <TrendingUp size={28} />;
      title = "Advertencia";
      message =
        "Los gastos representan más del 80% de los ingresos. Conviene revisar los costos para mejorar la rentabilidad.";
    }
  
    return (
      <section className={styles.card}>
        <div className={styles.icon}>
          {icon}
        </div>
  
        <div className={styles.content}>
          <h3>{title}</h3>
  
          <p>{message}</p>
        </div>
      </section>
    );
  }