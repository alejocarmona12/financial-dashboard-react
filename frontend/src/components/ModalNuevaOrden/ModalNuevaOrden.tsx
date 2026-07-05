import { useEffect, useState } from "react";
import styles from "./ModalNuevaOrden.module.css";

import type { Orden } from "../../types/Orden";
import {
  crearOrden,
  actualizarOrden,
} from "../../services/OrdenService";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  orden?: Orden | null;
}

const formularioInicial: Orden = {
  numero: "",
  cliente: "",
  fecha: "",
  estado: "Pendiente",
  total: 0,
  descripcion: "",
  archivo: null,
};

export default function ModalNuevaOrden({
  open,
  onClose,
  onSuccess,
  orden,
}: Props) {
  const [formData, setFormData] =
    useState<Orden>(formularioInicial);

  const [errores, setErrores] = useState({
    numero: "",
    cliente: "",
    fecha: "",
    total: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (orden) {
      setFormData({
        ...orden,
        fecha: orden.fecha
          ? new Date(orden.fecha)
              .toISOString()
              .slice(0, 10):"",
      });
    } else {
      setFormData(formularioInicial);
    }
  
    setErrores({
      numero: "",
      cliente: "",
      fecha: "",
      total: "",
    });
  }, [orden, open]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "total"
          ? Number(value)
          : value,
    }));

    setErrores((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0] || null;

    setFormData((prev) => ({
      ...prev,
      archivo: file,
    }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {
      numero: "",
      cliente: "",
      fecha: "",
      total: "",
    };

    let esValido = true;

    if (!formData.numero.trim()) {
      nuevosErrores.numero =
        "El número de la orden es obligatorio";
      esValido = false;
    }

    if (!formData.cliente.trim()) {
      nuevosErrores.cliente =
        "El cliente es obligatorio";
      esValido = false;
    }

    if (!formData.fecha) {
      nuevosErrores.fecha =
        "La fecha es obligatoria";
      esValido = false;
    }

    if (formData.total <= 0) {
      nuevosErrores.total =
        "El total debe ser mayor a cero";
      esValido = false;
    }

    setErrores(nuevosErrores);

    return esValido;
  };

  const limpiarFormulario = () => {
    setFormData(formularioInicial);

    setErrores({
      numero: "",
      cliente: "",
      fecha: "",
      total: "",
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
  
    if (!validarFormulario()) return;
  
    setLoading(true);
  
    try {
      if (orden?._id) {
        await actualizarOrden(
          orden._id,
          formData
        );
  
        alert("Orden actualizada correctamente");
      } else {
        await crearOrden(formData);
  
        alert("Orden creada correctamente");
      }
  
      limpiarFormulario();
  
      onSuccess();
  
      onClose();
    } catch (error) {
      console.error(error);
  
      alert(
        orden
          ? "Error al actualizar la orden"
          : "Error al crear la orden"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>
          {orden
            ? "Editar Orden de Compra"
            : "Nueva Orden de Compra"}
        </h2>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <div className={styles.group}>
            <label>N° Orden</label>

            <input
              type="text"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              placeholder="OC-0001"
            />

            {errores.numero && (
              <span className={styles.error}>
                {errores.numero}
              </span>
            )}
          </div>

          <div className={styles.group}>
            <label>Cliente</label>

            <input
              type="text"
              name="cliente"
              value={formData.cliente}
              onChange={handleChange}
              placeholder="LDC Argentina"
            />

            {errores.cliente && (
              <span className={styles.error}>
                {errores.cliente}
              </span>
            )}
          </div>

          <div className={styles.group}>
            <label>Fecha</label>

            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
            />

            {errores.fecha && (
              <span className={styles.error}>
                {errores.fecha}
              </span>
            )}
          </div>

          <div className={styles.group}>
            <label>Estado</label>

            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
            >
              <option value="Pendiente">
                Pendiente
              </option>
              <option value="Facturada">
                Facturada
              </option>
              <option value="Cobrada">
                Cobrada
              </option>
              <option value="Cancelada">
                Cancelada
              </option>
            </select>
          </div>

          <div className={styles.group}>
            <label>Total</label>

            <input
              type="number"
              name="total"
              value={formData.total}
              onChange={handleChange}
              placeholder="0"
            />

            {errores.total && (
              <span className={styles.error}>
                {errores.total}
              </span>
            )}
          </div>

          <div className={styles.group}>
            <label>Adjuntar PDF</label>

            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
            />
          </div>

          <div className={styles.full}>
            <label>Descripción</label>

            <textarea
              rows={5}
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Detalle de los trabajos..."
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
                : orden
                ? "Actualizar Orden"
                : "Guardar Orden"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}