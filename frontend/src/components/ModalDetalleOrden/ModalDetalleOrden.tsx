import {
  Calendar,
  User,
  FileText,
  Receipt,
  DollarSign,
  Hash,
} from "lucide-react";

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
        <h2>📄 Detalle de la Orden</h2>

        <div className={styles.grid}>
          <div className={styles.infoCard}>
            <Hash size={20} />
            <strong>N° Orden</strong>
            <span>{orden.numero}</span>
          </div>

          <div className={styles.infoCard}>
            <User size={20} />
            <strong>Cliente</strong>
            <span>{orden.cliente}</span>
          </div>

          <div className={styles.infoCard}>
            <Calendar size={20} />
            <strong>Fecha</strong>
            <span>
              {new Date(orden.fecha).toLocaleDateString("es-AR")}
            </span>
          </div>

          <div className={styles.infoCard}>
            <strong>Estado</strong>
            <EstadoOrden estado={orden.estado} />
          </div>

          <div className={`${styles.infoCard} ${styles.total}`}>
            <DollarSign size={20} />
            <strong>Total</strong>
            <span>
              ${orden.total.toLocaleString("es-AR")}
            </span>
          </div>
        </div>

        <div className={styles.descripcion}>
          <h3>Descripción</h3>

          <p>
            {orden.descripcion || "Sin descripción"}
          </p>
        </div>

        <div className={styles.documentos}>
          <h3>Documentos</h3>

          <div className={styles.documento}>
            <div>
              <FileText size={20} />
              <span>Orden de Compra</span>
            </div>

            {orden.archivo ? (
              <button
                onClick={() =>
                  window.open(
                    `${API}/${orden.archivo}`,
                    "_blank"
                  )
                }
              >
                Ver PDF
              </button>
            ) : (
              <small>No disponible</small>
            )}
          </div>

          <div className={styles.documento}>
            <div>
              <Receipt size={20} />
              <span>Factura</span>
            </div>

            {orden.factura ? (
              <button
                onClick={() =>
                  window.open(
                    `${API}/${orden.factura}`,
                    "_blank"
                  )
                }
              >
                Ver PDF
              </button>
            ) : (
              <small>No disponible</small>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <button onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}