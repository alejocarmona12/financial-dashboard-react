import styles from "./TablaCombustible.module.css";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { type Combustible } from "../../types/Combustible";

interface Props {
  cargas: Combustible[];
  onVer: (carga: Combustible) => void;
  onEditar: (carga: Combustible) => void;
  onEliminar: (id: string) => void;
}

export default function TablaCombustible({
  cargas,
  onVer,
  onEditar,
  onEliminar,
}: Props) {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Equipo</th>
            <th>Operador</th>
            <th>Litros</th>
            <th>Precio/L</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {cargas.length === 0 ? (
            <tr>
              <td colSpan={7} className={styles.empty}>
                No hay cargas registradas.
              </td>
            </tr>
          ) : (
            cargas.map((carga) => (
              <tr key={carga._id}>
                <td>
                  {new Date(carga.fecha).toLocaleDateString("es-AR")}
                </td>

                <td>{carga.equipo}</td>

                <td>{carga.operador}</td>

                <td>
                  {carga.litros.toLocaleString("es-AR")} L
                </td>

                <td>
                  ${carga.precioLitro.toLocaleString("es-AR")}
                </td>

                <td className={styles.total}>
                  ${carga.total.toLocaleString("es-AR")}
                </td>

                <td className={styles.actions}>
                  <button
                    className={styles.viewButton}
                    onClick={() => onVer(carga)}
                    title="Ver detalle"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    className={styles.editButton}
                    onClick={() => onEditar(carga)}
                    title="Editar"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    className={styles.deleteButton}
                    onClick={() => {
                      if (carga._id) {
                        onEliminar(carga._id);
                      }
                    }}
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}