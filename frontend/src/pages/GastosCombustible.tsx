import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";

export default function GastosCombustible() {
  const navigate = useNavigate();

  const [fecha, setFecha] = useState("");
  const [tipo, setTipo] = useState("camioneta");
  const [equipo, setEquipo] = useState("");
  const [litros, setLitros] = useState("");
  const [precioLitro, setPrecioLitro] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const total =
    Number(litros || 0) *
    Number(precioLitro || 0);

  const handleGuardar = () => {
    if (!fecha || !equipo || !litros || !precioLitro) {
      alert("Completa todos los campos obligatorios");
      return;
    }

    console.log({
      fecha,
      tipo,
      equipo,
      litros: Number(litros),
      precioLitro: Number(precioLitro),
      total,
      observaciones,
    });

    alert("Registro listo para guardar");

    setFecha("");
    setTipo("camioneta");
    setEquipo("");
    setLitros("");
    setPrecioLitro("");
    setObservaciones("");
  };

  return (
    <div className={styles.dashboard}>
      {/* HEADER */}
      <div className={styles.header}>
        <h2>Gestión de Combustible</h2>

        <div className={styles.actions}>
          <button
            className={styles.primary}
            onClick={() => navigate("/dashboard")}
          >
            Volver al Dashboard
          </button>
        </div>
      </div>

      {/* FORMULARIO */}
      <div className={styles.form}>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />

        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="camioneta">Camioneta</option>
          <option value="tractor">Tractor</option>
          <option value="maquina">Máquina</option>
        </select>

        <select
          value={equipo}
          onChange={(e) => setEquipo(e.target.value)}
        >
          <option value="">Seleccionar equipo</option>

          <option value="Hilux">Hilux</option>
          <option value="Amarok">Amarok</option>
        </select>

        <input
          type="number"
          placeholder="Litros"
          value={litros}
          onChange={(e) => setLitros(e.target.value)}
        />

        <input
          type="number"
          placeholder="Precio por litro"
          value={precioLitro}
          onChange={(e) => setPrecioLitro(e.target.value)}
        />

        <button onClick={handleGuardar}>
          Guardar
        </button>
      </div>

      {/* OBSERVACIONES */}
      <div style={{ marginBottom: "30px" }}>
        <textarea
          placeholder="Observaciones"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          style={{
            width: "100%",
            minHeight: "120px",
            padding: "14px",
            borderRadius: "12px",
            background: "var(--bg-input)",
            border: "1px solid rgba(139,127,164,.4)",
            color: "var(--text-main)",
            resize: "vertical",
          }}
        />
      </div>

      {/* TARJETAS */}
      <div className={styles.balance}>
        <div className={styles.card}>
          <h3>Litros</h3>
          <p>{Number(litros || 0)}</p>
        </div>

        <div className={styles.card}>
          <h3>Precio por Litro</h3>
          <p>
            $
            {Number(precioLitro || 0).toLocaleString("es-AR")}
          </p>
        </div>

        <div className={`${styles.card} ${styles.balanceCard}`}>
          <h3>Total de la Carga</h3>
          <p>
            $
            {total.toLocaleString("es-AR")}
          </p>
        </div>
      </div>
    </div>
  );
}