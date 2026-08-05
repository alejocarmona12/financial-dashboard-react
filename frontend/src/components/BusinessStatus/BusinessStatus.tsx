import {
  FileText,
  Fuel,
  ClipboardList,
  DollarSign,
} from "lucide-react";

import styles from "./BusinessStatus.module.css";

interface Props {
  facturasPendientes: number;
  ordenesPendientes: number;
  combustibleMes: number;
  cobradoMes: number;
}

export default function BusinessStatus({
  facturasPendientes,
  ordenesPendientes,
  combustibleMes,
  cobradoMes,
}: Props) {
  const cards = [
    {
      title: "Facturas pendientes",
      value: facturasPendientes,
      description: "Pendientes de cobro",
      icon: FileText,
      color: styles.warning,
    },
    {
      title: "Órdenes abiertas",
      value: ordenesPendientes,
      description: "En proceso",
      icon: ClipboardList,
      color: styles.info,
    },
    {
      title: "Combustible",
      value: `$${combustibleMes.toLocaleString("es-AR")}`,
      description: "Consumo del mes",
      icon: Fuel,
      color: styles.primary,
    },
    {
      title: "Cobrado este mes",
      value: `$${cobradoMes.toLocaleString("es-AR")}`,
      description: "Ingresos registrados",
      icon: DollarSign,
      color: styles.success,
    },
  ];

  return (
    <section className={styles.container}>
      <h2>Estado del negocio</h2>

      <div className={styles.grid}>
        {cards.map((card) => (
          <div className={styles.card} key={card.title}>
            <div className={styles.header}>
              <card.icon
                className={card.color}
                size={28}
              />

              <span>{card.title}</span>
            </div>

            <strong>{card.value}</strong>

            <small>{card.description}</small>
          </div>
        ))}
      </div>
    </section>
  );
}