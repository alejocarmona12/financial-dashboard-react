import { useState } from "react";
import styles from "./ModalNuevaTransaccion.module.css";
import type { Transaction } from "../../hooks/useTransactions";

interface Props {
  onClose: () => void;
  onSave: (transaction: Transaction) => Promise<void>;
}

export default function ModalNuevaTransaccion({
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<Transaction>({
    title: "",
    amount: 0,
    type: "expense",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    hasIVA: false,
  });

  const [loading, setLoading] = useState(false);

  const [errores, setErrores] = useState({
    title: "",
    category: "",
    amount: "",
    date: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type, checked } =
      e.target as HTMLInputElement;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "amount"
          ? Number(value)
          : value,
    }));

    setErrores((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {
      title: "",
      category: "",
      amount: "",
      date: "",
    };

    let esValido = true;

    if (!form.title.trim()) {
      nuevosErrores.title =
        "El título es obligatorio";
      esValido = false;
    }

    if (!form.category.trim()) {
      nuevosErrores.category =
        "La categoría es obligatoria";
      esValido = false;
    }

    if (form.amount <= 0) {
      nuevosErrores.amount =
        "El monto debe ser mayor a cero";
      esValido = false;
    }

    if (!form.date) {
      nuevosErrores.date =
        "La fecha es obligatoria";
      esValido = false;
    }

    setErrores(nuevosErrores);

    return esValido;
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    setLoading(true);

    try {
      await onSave(form);

      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div>
            <h2>📊 Nuevo Movimiento</h2>

            <p>
              Registrá un ingreso o un gasto de la empresa.
            </p>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <div className={styles.group}>
            <label>Título</label>

            <input
              name="title"
              placeholder="Ej: Venta de repuestos"
              value={form.title}
              onChange={handleChange}
            />

            {errores.title && (
              <span className={styles.error}>
                {errores.title}
              </span>
            )}
          </div>

          <div className={styles.group}>
            <label>Categoría</label>

            <input
              name="category"
              placeholder="Ventas"
              value={form.category}
              onChange={handleChange}
            />

            {errores.category && (
              <span className={styles.error}>
                {errores.category}
              </span>
            )}
          </div>

          <div className={styles.group}>
            <label>Monto</label>

            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
            />

            {errores.amount && (
              <span className={styles.error}>
                {errores.amount}
              </span>
            )}
          </div>

          <div className={styles.group}>
            <label>Tipo</label>

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              <option value="income">
                Ingreso
              </option>

              <option value="expense">
                Gasto
              </option>
            </select>
          </div>

          <div className={styles.group}>
            <label>Fecha</label>

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />

            {errores.date && (
              <span className={styles.error}>
                {errores.date}
              </span>
            )}
          </div>

          <div className={styles.group}>
            <label>IVA</label>

            <label className={styles.checkbox}>
              <input
                type="checkbox"
                name="hasIVA"
                checked={form.hasIVA}
                onChange={handleChange}
              />

              Incluye IVA
            </label>
          </div>

          <div className={styles.full}>
            <label>Descripción</label>

            <textarea
              rows={5}
              name="description"
              placeholder="Detalle del movimiento..."
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className={styles.buttons}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Guardando..."
                : "Guardar Movimiento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}