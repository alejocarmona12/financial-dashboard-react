
import { useEffect, useState } from "react";
import styles from "./ModalNuevaOrden.module.css";
import { X } from "lucide-react";
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
  factura: null,
};

const formatearFechaParaInput = (fecha?: string) => {
  if (!fecha) return "";

  const fechaParseada = new Date(fecha);

  return Number.isNaN(fechaParseada.getTime())
    ? ""
    : fechaParseada.toISOString().slice(0, 10);
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
    fechaCobro: "",
    total: "",
  });

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (orden) {
      setFormData({
        ...orden,

        fecha: formatearFechaParaInput(orden.fecha),

        fechaCobro: formatearFechaParaInput(orden.fechaCobro),

        archivo: orden.archivo ?? null,

        factura: orden.factura ?? null,
      });
    } else {
      setFormData(formularioInicial);
    }

    setErrores({
      numero: "",
      cliente: "",
      fecha: "",
      fechaCobro: "",
      total: "",
    });
  }, [orden, open]);

  const handleChange = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
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
    const { name, files } = e.target;

    const file = files?.[0] || null;

    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {
    numero: "",
    cliente: "",
    fecha: "",
    fechaCobro: "",
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

    if (
      formData.estado === "Cobrada" &&
      !formData.fechaCobro
    ) {
      nuevosErrores.fechaCobro =
        "La fecha de cobro es obligatoria";
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
      fechaCobro: "",
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

        alert(
          "Orden actualizada correctamente"
        );
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
      <div className={styles.modalHeader}>
  <div>
    <h2>
      {orden
        ? "✏️ Editar Orden de Compra"
        : "📄 Nueva Orden de Compra"}
    </h2>

    <p>
      Completá la información de la orden.
    </p>
  </div>

  <button
    type="button"
    className={styles.closeButton}
    onClick={onClose}
  >
    <X size={22} />
  </button>
</div>

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

          {formData.estado === "Cobrada" && (
            <div className={styles.group}>
              <label>Fecha de cobro</label>

              <input
                type="date"
                name="fechaCobro"
                value={formData.fechaCobro ?? ""}
                onChange={handleChange}
              />

              {errores.fechaCobro && (
                <span className={styles.error}>
                  {errores.fechaCobro}
                </span>
              )}
            </div>
          )}

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

          {/* PDF ORDEN */}

          <div className={styles.group}>
            <label>Orden de Compra (PDF)</label>

          <label className={styles.uploadBox}>
            <input
              type="file"
              name="archivo"
              accept=".pdf"
              onChange={handleFileChange}
            />

            <span>
              {formData.archivo instanceof File
                ? formData.archivo.name
                : "📎 Seleccionar PDF"}
            </span>
          </label>

          {typeof formData.archivo === "string" &&
            formData.archivo && (
              <small className={styles.fileLoaded}>
                 Archivo cargado
              </small>
            )}
        </div>

          {/* PDF FACTURA */}

          <div className={styles.group}>
            <label>Factura (PDF)</label>

            <label className={styles.uploadBox}>
              <input
                type="file"
                name="factura"
                accept=".pdf"
                onChange={handleFileChange}
              />

              <span>
                {formData.factura instanceof File
                  ? formData.factura.name
                  : "📎 Seleccionar PDF"}
              </span>
            </label>

            {typeof formData.factura === "string" &&
              formData.factura && (
                <small className={styles.fileLoaded}>
                  ✅ Factura cargada
                </small>
              )}
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
