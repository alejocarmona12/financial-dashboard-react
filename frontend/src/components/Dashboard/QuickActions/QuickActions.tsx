import {
  Plus,
  FileText,
  Fuel,
  Receipt,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import styles from "./QuickActions.module.css";

interface Props {
  onNuevoMovimiento: () => void;
}

export default function QuickActions({
  onNuevoMovimiento,
}: Props) {
  const navigate = useNavigate();

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Acciones rápidas</h2>

      <div className={styles.grid}>
        <button
          className={styles.card}
          onClick={onNuevoMovimiento}
        >
          <Plus size={34} />
          <span>Nuevo movimiento</span>
        </button>

        <button
          className={styles.card}
          onClick={() => navigate("/ordenes-compra")}
        >
          <FileText size={34} />
          <span>Órdenes de compra</span>
        </button>

        <button
          className={styles.card}
          onClick={() => navigate("/facturacion")}
        >
          <Receipt size={34} />
          <span>Facturación</span>
        </button>

        <button
          className={styles.card}
          onClick={() => navigate("/gastos-combustible")}
        >
          <Fuel size={34} />
          <span>Combustible</span>
        </button>
      </div>
    </section>
  );
}
