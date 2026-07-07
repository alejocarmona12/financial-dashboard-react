import { useState } from "react";
import styles from "./ModalFactura.module.css";

interface Props {
  open: boolean;
  onClose: () => void;
  onGuardar: (file: File, fecha: string) => Promise<void>;
}

export default function ModalFactura({
  open,
  onClose,
  onGuardar,
}: Props) {
  const [archivo, setArchivo] = useState<File | null>(null);

  const [fecha, setFecha] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const guardar = async () => {
    if (!archivo) {
      alert("Seleccione un PDF.");
      return;
    }

    setLoading(true);

    try {
      await onGuardar(archivo, fecha);

      setArchivo(null);

      onClose();
    } catch (error) {
      console.error(error);

      alert("Error al subir la factura");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Subir Factura</h2>

        <div className={styles.group}>
          <label>PDF Factura</label>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) =>
              setArchivo(e.target.files?.[0] || null)
            }
          />
        </div>

        <div className={styles.group}>
          <label>Fecha Factura</label>

          <input
            type="date"
            value={fecha}
            onChange={(e) =>
              setFecha(e.target.value)
            }
          />
        </div>

        <div className={styles.buttons}>
          <button onClick={onClose}>
            Cancelar
          </button>

          <button
            disabled={loading}
            onClick={guardar}
          >
            {loading
              ? "Guardando..."
              : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}