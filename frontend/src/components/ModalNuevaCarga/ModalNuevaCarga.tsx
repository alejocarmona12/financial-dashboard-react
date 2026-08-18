import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import styles from "./ModalNuevaCarga.module.css";
import type { Combustible } from "../../types/Combustible";

interface Props {
  open: boolean;
  onClose: () => void;
  carga?: Combustible | null;
  onGuardar?: (data: Combustible) => void;
}

const formularioInicial: Combustible = {
  fecha: "",
  tipo: "camioneta",
  equipo: "",
  operador: "",
  litros: 0,
  precioLitro: 0,
  total: 0,
  observaciones: "",
};

const formatearFechaParaInput = (fecha: string) => {
  const fechaParseada = new Date(fecha);

  return Number.isNaN(fechaParseada.getTime())
    ? ""
    : fechaParseada.toISOString().slice(0, 10);
};

export default function ModalNuevaCarga({
  open,
  onClose,
  carga,
  onGuardar,
}: Props) {
  const [formData, setFormData] =
    useState<Combustible>(formularioInicial);

  const [loading, setLoading] =
    useState(false);

  const [errores, setErrores] = useState({
    fecha: "",
    equipo: "",
    operador: "",
    litros: "",
    precioLitro: "",
  });

  useEffect(() => {
    if (carga) {
      setFormData({
        ...carga,
        fecha: formatearFechaParaInput(carga.fecha),
      });
    } else {
      setFormData(formularioInicial);
    }

    setErrores({
      fecha: "",
      equipo: "",
      operador: "",
      litros: "",
      precioLitro: "",
    });
  }, [carga, open]);

  const total = useMemo(() => {
    return (
      Number(formData.litros) *
      Number(formData.precioLitro)
    );
  }, [formData.litros, formData.precioLitro]);

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
        name === "litros" ||
        name === "precioLitro"
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
      fecha: "",
      equipo: "",
      operador: "",
      litros: "",
      precioLitro: "",
    };

    let valido = true;

    if (!formData.fecha) {
      nuevosErrores.fecha =
        "La fecha es obligatoria";
      valido = false;
    }

    if (!formData.equipo.trim()) {
      nuevosErrores.equipo =
        "Ingrese un equipo";
      valido = false;
    }

    if (!formData.operador.trim()) {
      nuevosErrores.operador =
        "Ingrese un operador";
      valido = false;
    }

    if (formData.litros <= 0) {
      nuevosErrores.litros =
        "Los litros deben ser mayores a cero";
      valido = false;
    }

    if (formData.precioLitro <= 0) {
      nuevosErrores.precioLitro =
        "Ingrese un precio válido";
      valido = false;
    }

    setErrores(nuevosErrores);

    return valido;
  };

  const limpiarFormulario = () => {
    setFormData(formularioInicial);

    setErrores({
      fecha: "",
      equipo: "",
      operador: "",
      litros: "",
      precioLitro: "",
    });
  };

  const guardar = async () => {
    if (!validarFormulario()) return;

    setLoading(true);

    try {
      await onGuardar?.({
        ...formData,
        total,
      });

      limpiarFormulario();

      onClose();
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
              {carga
                ? "✏️ Editar Carga"
                : "⛽ Nueva Carga"}
            </h2>

            <p>
              {carga
                ? "Actualizá la información de la carga."
                : "Registrá una nueva carga de combustible."}
            </p>
          </div>

          <button
            className={styles.closeButton}
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>

        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            guardar();
          }}
        >
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
            <label>Tipo</label>

            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
            >
              <option value="camioneta">
                Camioneta
              </option>

              <option value="tractor">
                Tractor
              </option>

              <option value="maquina">
                Máquina
              </option>
            </select>
          </div>

          <div className={styles.group}>
            <label>Equipo</label>

            <input
              name="equipo"
              value={formData.equipo}
              onChange={handleChange}
            />

            {errores.equipo && (
              <span className={styles.error}>
                {errores.equipo}
              </span>
            )}
          </div>

          <div className={styles.group}>
            <label>Operador</label>

            <input
              name="operador"
              value={formData.operador}
              onChange={handleChange}
            />

            {errores.operador && (
              <span className={styles.error}>
                {errores.operador}
              </span>
            )}
          </div>

          <div className={styles.group}>
            <label>Litros</label>

            <input
              type="number"
              name="litros"
              value={formData.litros}
              onChange={handleChange}
            />

            {errores.litros && (
              <span className={styles.error}>
                {errores.litros}
              </span>
            )}
          </div>

          <div className={styles.group}>
            <label>Precio por Litro</label>

            <input
              type="number"
              name="precioLitro"
              value={formData.precioLitro}
              onChange={handleChange}
            />

            {errores.precioLitro && (
              <span className={styles.error}>
                {errores.precioLitro}
              </span>
            )}
          </div>

          <div className={styles.full}>
            <label>Total</label>

            <input
              className={styles.totalInput}
              value={`$ ${total.toLocaleString("es-AR")}`}
              disabled
            />
          </div>

          <div className={styles.full}>
            <label>Observaciones</label>

            <textarea
              rows={5}
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              placeholder="Ingrese alguna observación..."
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
                : carga
                ? "Actualizar Carga"
                : "Guardar Carga"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
