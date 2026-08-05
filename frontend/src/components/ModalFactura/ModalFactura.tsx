import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import styles from "./ModalFactura.module.css";

interface Props {
  open: boolean;
  onClose: () => void;
  onGuardar: (
    file: File,
    fecha: string
  ) => Promise<void>;
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

  useEffect(() => {
    if (open) {
      setArchivo(null);

      setFecha(
        new Date().toISOString().slice(0, 10)
      );
    }
  }, [open]);

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

        <div className={styles.header}>
          <div>
            <h2>🧾 Subir Factura</h2>

            <p>
              Adjuntá el PDF de la factura emitida.
            </p>
          </div>

          <button
            className={styles.closeButton}
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.group}>
          <label>Factura (PDF)</label>

          <label className={styles.uploadBox}>
            <Upload size={20} />

            <span>
              {archivo
                ? archivo.name
                : "Seleccionar archivo PDF"}
            </span>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) =>
                setArchivo(
                  e.target.files?.[0] || null
                )
              }
            />
          </label>
        </div>

        <div className={styles.group}>
          <label>Fecha Facturada</label>

          <input
            type="date"
            value={fecha}
            onChange={(e) =>
              setFecha(e.target.value)
            }
          />
        </div>

        <div className={styles.buttons}>
          <button
            className={styles.cancel}
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            className={styles.save}
            onClick={guardar}
            disabled={loading}
          >
            {loading
              ? "Guardando..."
              : "Guardar Factura"}
          </button>
        </div>

      </div>
    </div>
  );
}