import {
  obtenerCargas,
  crearCarga,
  actualizarCarga,
  eliminarCarga,
} from "../services/CombustibleService";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Fuel, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import styles from "./Combustible.module.css";
import ResumenCard from "../components/ResumenCard/ResumenCard";
import { type Combustible } from "../types/Combustible";
import TablaCombustible from "../components/TablaCombustible/TablaCombustible";
import ModalNuevaCarga from "../components/ModalNuevaCarga/ModalNuevaCarga";
import ModalDetalleCarga from "../components/ModalDetalleCarga/ModalDetalleCarga";



export default function Combustible() {
  const navigate = useNavigate();

  const [cargas, setCargas] = useState<Combustible[]>([]);

  const [busqueda, setBusqueda] = useState("");

  const [modalNuevaCarga, setModalNuevaCarga] = useState(false);

  const [cargaSeleccionada, setCargaSeleccionada] =
    useState<Combustible | null>(null);
  const [openDetalle, setOpenDetalle] =
    useState(false);

    const cargarCargas = async () => {
      try {
        setLoading(true);
    
        const data = await obtenerCargas();
    
        setCargas(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    useEffect(() => {
      cargarCargas();
    }, []);

  const [loading, setLoading] = useState(true);
  const [tipoFiltro, setTipoFiltro] = useState<
  "Todos" | "camioneta" | "tractor" | "maquina"
>("Todos");
  const cargasFiltradas = useMemo(() => {
    return cargas.filter((carga) => {
      const texto = busqueda.toLowerCase();
  
      const coincideBusqueda =
        carga.equipo.toLowerCase().includes(texto) ||
        carga.operador.toLowerCase().includes(texto);
  
      const coincideTipo =
        tipoFiltro === "Todos" ||
        carga.tipo === tipoFiltro;
  
      return coincideBusqueda && coincideTipo;
    });
  }, [busqueda, tipoFiltro, cargas]);
 


  const litrosMes = cargas.reduce(
    (acc, item) => acc + item.litros,
    0
  );

  const gastoMes = cargas.reduce(
    (acc, item) => acc + item.total,
    0
  );

  const precioPromedio =
    litrosMes > 0
      ? gastoMes / litrosMes
      : 0;

      const abrirNuevaCarga = () => {
        setCargaSeleccionada(null);
        setModalNuevaCarga(true);
      
      };
    
      const cerrarNuevaCarga = () => {
        setModalNuevaCarga(false);
      };
    
      const verCarga = (carga: Combustible) => {
        setCargaSeleccionada(carga);
        setOpenDetalle(true);
      };
      const editarCarga = (carga: Combustible) => {
        setCargaSeleccionada(carga);
        setModalNuevaCarga(true);
      };
    
      const handleEliminar = async (id: string) => {
        const result = await Swal.fire({
          title: "¿Eliminar carga?",
          text: "Esta acción no se puede deshacer.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#ef4444",
          cancelButtonColor: "#6b7280",
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
          background: "#1d1f24",
          color: "#ffffff",
        });
      
        if (!result.isConfirmed) return;
      
        try {
          await eliminarCarga(id);
      
          await cargarCargas();
      
          await Swal.fire({
            icon: "success",
            title: "Carga eliminada",
            text: "La carga fue eliminada correctamente.",
            timer: 1800,
            showConfirmButton: false,
            background: "#1d1f24",
            color: "#ffffff",
          });
        } catch (error) {
          console.error(error);
      
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo eliminar la carga.",
            background: "#1d1f24",
            color: "#ffffff",
          });
        }
      };

      return (
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <div>
              <button
                className={styles.backButton}
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft size={18} />
                Volver al Dashboard
              </button>
    
              <h1 className={styles.title}>
                <Fuel size={28} />
                Gestión de Combustible
              </h1>
    
              <p className={styles.subtitle}>
                Administrá todas las cargas de combustible de la empresa.
              </p>
            </div>
    
            <button
              className={styles.newButton}
              onClick={abrirNuevaCarga}
            >
              <Plus size={18} />
              Nueva Carga
            </button>
          </div>
    
          {/* Tarjetas */}
          <div className={styles.cards}>
              <ResumenCard
                titulo="Litros del Mes"
                valor={`${litrosMes.toLocaleString("es-AR")} L`}
                color="#00f0ff"
              />

              <ResumenCard
                titulo="Gasto del Mes"
                valor={`$${gastoMes.toLocaleString("es-AR")}`}
                color="#05ffc3"
              />

              <ResumenCard
                titulo="Precio Promedio"
                valor={`$${precioPromedio.toFixed(2)}`}
                color="#ffc107"
              />

              <ResumenCard
                titulo="Cargas"
                valor={cargas.length}
                color="#ffffff"
              />
        </div>
    
          {/* Buscador */}
          <div className={styles.filters}>
          <div className={styles.search}>
                 <Search size={18} />

            <input
              type="text"
              placeholder="Buscar por equipo u operador..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

          {busqueda && (
            <button
              className={styles.clear}
              onClick={() => setBusqueda("")}
            >
              ✕
            </button>
          )}
            </div>

            <select
              value={tipoFiltro}
              onChange={(e) =>
                setTipoFiltro(
                  e.target.value as
                    | "Todos"
                    | "camioneta"
                    | "tractor"
                    | "maquina"
                )
              }
            >
              <option value="Todos">Todos</option>
              <option value="camioneta">Camioneta</option>
              <option value="tractor">Tractor</option>
              <option value="maquina">Máquina</option>
            </select>
          </div>
    
          {/* Tabla */}
          {loading ? (
          <div className={styles.loading}>
             <div className={styles.spinner}></div>

             <span>Cargando cargas...</span>
           </div>
          ) : (
          <TablaCombustible
            cargas={cargasFiltradas}
            onVer={verCarga}
            onEditar={editarCarga}
            onEliminar={handleEliminar}
          />
          )}
    
          {/* Modal */}
          <ModalNuevaCarga
            open={modalNuevaCarga}
            onClose={cerrarNuevaCarga}
            carga={cargaSeleccionada}
            onGuardar={async (nuevaCarga) => {
              try {
                if (cargaSeleccionada?._id) {
                  await actualizarCarga(
                    cargaSeleccionada._id,
                    nuevaCarga
                  );
            
                  await Swal.fire({
                    icon: "success",
                    title: "Carga actualizada",
                    text: "Los cambios fueron guardados correctamente.",
                    timer: 1800,
                    showConfirmButton: false,
                    background: "#1d1f24",
                    color: "#ffffff",
                  });
                } else {
                  await crearCarga(nuevaCarga);
            
                  await Swal.fire({
                    icon: "success",
                    title: "Carga creada",
                    text: "La carga fue registrada correctamente.",
                    timer: 1800,
                    showConfirmButton: false,
                    background: "#1d1f24",
                    color: "#ffffff",
                  });
                }
            
                await cargarCargas();
            
                cerrarNuevaCarga();
              } catch (error) {
                console.error(error);
            
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: "No se pudo guardar la carga.",
                  background: "#1d1f24",
                  color: "#ffffff",
                });
              }
            }}
  
/>
<ModalDetalleCarga
    open={openDetalle}
    carga={cargaSeleccionada}
    onClose={() => {
        setOpenDetalle(false);
        setCargaSeleccionada(null);
    }}
/>

        </div>
      );
    }