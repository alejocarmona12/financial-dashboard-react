import {
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  ReceiptText,
} from "lucide-react";

import styles from "./SummaryCards.module.css";

interface Props {
  ingresos: number;
  gastos: number;
  balance: number;
  iva: number;
}

const formatMoney = (value: number) =>
  value.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });

export default function SummaryCards({
  ingresos,
  gastos,
  balance,
  iva,
}: Props) {
  const cards = [
    {
      title: "Ingresos",
      value: ingresos,
      Icon: ArrowUpCircle,
      iconClass: styles.iconIncome,
      description: "Dinero recibido",
      highlight: false,
    },
    {
      title: "Gastos",
      value: gastos,
      Icon: ArrowDownCircle,
      iconClass: styles.iconExpense,
      description: "Dinero gastado",
      highlight: false,
    },
    {
      title: "Balance",
      value: balance,
      Icon: Wallet,
      iconClass: styles.iconBalance,
      description: "Saldo actual",
      highlight: true,
    },
    {
      title: "IVA",
      value: iva,
      Icon: ReceiptText,
      iconClass: styles.iconIVA,
      description: "Impuesto acumulado",
      highlight: false,
    },
  ];

  return (
      <section className={styles.container}>
        <h2 className={styles.title}>Resumen financiero</h2>
    
        <div className={styles.grid}>
          {cards.map((card) => (
            <div
              key={card.title}
              className={`${styles.card} ${
                card.highlight ? styles.highlight : ""
              }`}
            >
              <div className={styles.header}>
                <card.Icon
                  className={card.iconClass}
                  size={28}
                />
    
                <span>{card.title}</span>
              </div>
    
              <h2>{formatMoney(card.value)}</h2>
    
              <small>{card.description}</small>
            </div>
          ))}
        </div>
      </section>
    );
}