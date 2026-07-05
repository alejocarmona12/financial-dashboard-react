import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import EstadoOrden from "../EstadoOrden/EstadoOrden";
import styles from "./TablaOrdenes.module.css";
import type { Orden } from "../../types/Orden";

interface Props {
  ordenes: Orden[];

  onVer: (orden: Orden) => void;

  onEditar: (orden: Orden) => void;

  onEliminar: (orden: Orden) => void;
}

export default function TablaOrdenes({
  ordenes,
  onVer,
  onEditar,
  onEliminar,
}: Props) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>N° OC</th>
          <th>Cliente</th>
          <th>Fecha</th>
          <th>Estado</th>
          <th>Total</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {ordenes.map((orden) => (
          <tr key={orden._id ?? orden.numero}>
            <td>{orden.numero}</td>

            <td>{orden.cliente}</td>

            <td>{orden.fecha}</td>

            <td>
              <EstadoOrden estado={orden.estado} />
            </td>

            <td>
              $
              {orden.total.toLocaleString("es-AR")}
            </td>

            <td>
              <div className={styles.actions}>
                <button
                  className={styles.iconButton}
                  onClick={() => onVer(orden)}
                >
                  <Eye size={18} />
                </button>

                <button
                  className={styles.iconButton}
                  onClick={() => onEditar(orden)}
                >
                  <Pencil size={18} />
                </button>

                <button
                  className={styles.iconButton}
                  onClick={() => onEliminar(orden)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}