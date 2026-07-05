import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";

import styles from "./OrdenesCompra.module.css";

import ResumenCard from "../components/ResumenCard/ResumenCard";
import TablaOrdenes from "../components/TablaOrdenes/TablaOrdenes";
import ModalNuevaOrden from "../components/ModalNuevaOrden/ModalNuevaOrden";
import ModalDetalleOrden from "../components/ModalDetalleOrden/ModalDetalleOrden";

import type { Orden, EstadoOrden } from "../types/Orden";

import {
  obtenerOrdenes,
  eliminarOrden,
} from "../services/OrdenService";

export default function OrdenesCompra() {
  const [openModal, setOpenModal] = useState(false);
  const [openDetalle, setOpenDetalle] = useState(false);

  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [ordenSeleccionada, setOrdenSeleccionada] =
    useState<Orden | null>(null);

  const [loading, setLoading] = useState(true);

  const [busqueda, setBusqueda] = useState("");

  const [estadoFiltro, setEstadoFiltro] =
    useState<"Todas" | EstadoOrden>("Todas");

  // ===============================
  // CARGAR ÓRDENES
  // ===============================

  const cargarOrdenes = async () => {
    try {
      setLoading(true);

      const data = await obtenerOrdenes();

      setOrdenes(data);
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarOrdenes();
  }, []);

  // ===============================
  // ACCIONES
  // ===============================

  const handleVer = (orden: Orden) => {
    setOrdenSeleccionada(orden);
    setOpenDetalle(true);
  };

  const handleEditar = (orden: Orden) => {
    setOpenDetalle(false);
    setOrdenSeleccionada(orden);
    setOpenModal(true);
  };

  const handleEliminar = async (orden: Orden) => {
    if (!orden._id) return;

    const confirmar = window.confirm(
      `¿Desea eliminar la orden ${orden.numero}?`
    );

    if (!confirmar) return;

    try {
      await eliminarOrden(orden._id);

      alert("Orden eliminada correctamente");

      cargarOrdenes();
    } catch (error) {
      console.error(error);

      alert("Error al eliminar la orden");
    }
  };

  // ===============================
  // FILTROS
  // ===============================

  const ordenesFiltradas = ordenes.filter((orden) => {
    const coincideBusqueda =
      orden.numero
        .toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      orden.cliente
        .toLowerCase()
        .includes(busqueda.toLowerCase());

    const coincideEstado =
      estadoFiltro === "Todas" ||
      orden.estado === estadoFiltro;

    return coincideBusqueda && coincideEstado;
  });

  // ===============================
  // TARJETAS
  // ===============================

  const pendientes = ordenes.filter(
    (o) => o.estado === "Pendiente"
  ).length;

  const facturadas = ordenes.filter(
    (o) => o.estado === "Facturada"
  ).length;

  const cobradas = ordenes.filter(
    (o) => o.estado === "Cobrada"
  ).length;

  const montoTotal = ordenes.reduce(
    (acc, orden) => acc + orden.total,
    0
  );

  return (
    <div className={styles.container}>
      {/* HEADER */}

      <div className={styles.header}>
        <h1 className={styles.title}>
          Órdenes de Compra
        </h1>

        <button
          className={styles.newButton}
          onClick={() => {
            setOrdenSeleccionada(null);
            setOpenDetalle(false);
            setOpenModal(true);
          }}
        >
          <Plus size={18} />
          Nueva OC
        </button>
      </div>

      {/* TARJETAS */}

      <div className={styles.cards}>
        <ResumenCard
          titulo="Pendientes"
          valor={pendientes}
          color="#ffc107"
        />

        <ResumenCard
          titulo="Facturadas"
          valor={facturadas}
          color="#00f0ff"
        />

        <ResumenCard
          titulo="Cobradas"
          valor={cobradas}
          color="#05ffc3"
        />

        <ResumenCard
          titulo="Monto Total"
          valor={`$${montoTotal.toLocaleString("es-AR")}`}
          color="#ffffff"
        />
      </div>

      {/* FILTROS */}

      <div className={styles.filters}>
        <div className={styles.search}>
          <Search size={18} />

          <input
            type="text"
            placeholder="Buscar por cliente o número..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <select
          value={estadoFiltro}
          onChange={(e) =>
            setEstadoFiltro(
              e.target.value as "Todas" | EstadoOrden
            )
          }
        >
          <option value="Todas">Todas</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Facturada">Facturada</option>
          <option value="Cobrada">Cobrada</option>
          <option value="Cancelada">Cancelada</option>
        </select>
      </div>

      {/* TABLA */}

      {loading ? (
        <div className={styles.loading}>
          Cargando órdenes...
        </div>
      ) : (
        <TablaOrdenes
          ordenes={ordenesFiltradas}
          onVer={handleVer}
          onEditar={handleEditar}
          onEliminar={handleEliminar}
        />
      )}

      {/* MODAL NUEVA / EDITAR */}

      <ModalNuevaOrden
        open={openModal}
        orden={ordenSeleccionada}
        onClose={() => {
          setOpenModal(false);
          setOrdenSeleccionada(null);
        }}
        onSuccess={cargarOrdenes}
      />

      {/* MODAL DETALLE */}

      <ModalDetalleOrden
        open={openDetalle}
        orden={ordenSeleccionada}
        onClose={() => {
          setOpenDetalle(false);
          setOrdenSeleccionada(null);
        }}
      />
    </div>
  );
}