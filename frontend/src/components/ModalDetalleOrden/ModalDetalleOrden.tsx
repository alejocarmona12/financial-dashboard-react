import styles from "./ModalDetalleOrden.module.css";
import type { Orden } from "../../types/Orden";
import EstadoOrden from "../EstadoOrden/EstadoOrden";

interface Props {
  open: boolean;
  orden: Orden | null;
  onClose: () => void;
}

export default function ModalDetalleOrden({
  open,
  orden,
  onClose,
}: Props) {
  if (!open || !orden) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Detalle de la Orden</h2>

        <div className={styles.info}>
          <div>
            <strong>N° Orden</strong>
            <span>{orden.numero}</span>
          </div>

          <div>
            <strong>Cliente</strong>
            <span>{orden.cliente}</span>
          </div>

          <div>
            <strong>Fecha</strong>
            <span>{orden.fecha}</span>
          </div>

          <div>
            <strong>Estado</strong>
            <EstadoOrden estado={orden.estado} />
          </div>

          <div>
            <strong>Total</strong>
            <span>
              ${orden.total.toLocaleString("es-AR")}
            </span>
          </div>

          <div className={styles.descripcion}>
            <strong>Descripción</strong>

            <p>
              {orden.descripcion || "Sin descripción"}
            </p>
          </div>
        </div>

        <div className={styles.buttons}>
          <button onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}