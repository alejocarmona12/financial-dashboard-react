import styles from "./ModalDetalleOrden.module.css";
import type { Orden } from "../../types/Orden";
import EstadoOrden from "../EstadoOrden/EstadoOrden";

interface Props {
  open: boolean;
  orden: Orden | null;
  onClose: () => void;
}

const API = "http://localhost:4000/uploads";

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

            <span>
              {new Date(
                orden.fecha
              ).toLocaleDateString("es-AR")}
            </span>
          </div>

          <div>
            <strong>Estado</strong>

            <EstadoOrden
              estado={orden.estado}
            />
          </div>

          <div>
            <strong>Total</strong>

            <span>
              $
              {orden.total.toLocaleString(
                "es-AR"
              )}
            </span>
          </div>

          <div className={styles.descripcion}>
            <strong>Descripción</strong>

            <p>
              {orden.descripcion ||
                "Sin descripción"}
            </p>
          </div>

          {/* ORDEN DE COMPRA */}

          <div className={styles.documento}>
            <strong>Orden de Compra</strong>

            {orden.archivo ? (
              <button
                onClick={() =>
                  window.open(
                    `${API}/${orden.archivo}`,
                    "_blank"
                  )
                }
              >
                📄 Ver Orden de Compra
              </button>
            ) : (
              <span>
                No hay PDF cargado
              </span>
            )}
          </div>

          {/* FACTURA */}

          <div className={styles.documento}>
            <strong>Factura</strong>

            {orden.factura ? (
              <button
                onClick={() =>
                  window.open(
                    `${API}/${orden.factura}`,
                    "_blank"
                  )
                }
              >
                🧾 Ver Factura
              </button>
            ) : (
              <span>
                No hay factura cargada
              </span>
            )}
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