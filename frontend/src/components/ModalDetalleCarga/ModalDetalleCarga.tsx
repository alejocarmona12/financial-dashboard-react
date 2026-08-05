import { X, Fuel } from "lucide-react";
import styles from "./ModalDetalleCarga.module.css";
import type { Combustible } from "../../types/Combustible";

interface Props {
  open: boolean;
  carga: Combustible | null;
  onClose: () => void;
}

export default function ModalDetalleCarga({
  open,
  carga,
  onClose,
}: Props) {
  if (!open || !carga) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div>
            <h2>
              <Fuel size={28} />
              Detalle de Carga
            </h2>

            <p>Información completa de la carga de combustible.</p>
          </div>

          <button
            className={styles.closeButton}
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.item}>
            <span>📅 Fecha</span>
            <strong>{carga.fecha}</strong>
          </div>

          <div className={styles.item}>
            <span>🚜 Tipo</span>
            <strong>{carga.tipo}</strong>
          </div>

          <div className={styles.item}>
            <span>🚛 Equipo</span>
            <strong>{carga.equipo}</strong>
          </div>

          <div className={styles.item}>
            <span>👷 Operador</span>
            <strong>{carga.operador}</strong>
          </div>

          <div className={styles.item}>
            <span>⛽ Litros</span>
            <strong>{carga.litros} L</strong>
          </div>

          <div className={styles.item}>
            <span>💲 Precio por litro</span>
            <strong>
              $
              {carga.precioLitro.toLocaleString("es-AR")}
            </strong>
          </div>

          <div className={styles.item}>
            <span>💰 Total</span>
            <strong>
              $
              {carga.total.toLocaleString("es-AR")}
            </strong>
          </div>

          <div className={styles.observaciones}>
            <span>📝 Observaciones</span>

            <p>
              {carga.observaciones ||
                "Sin observaciones."}
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