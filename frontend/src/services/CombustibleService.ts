import api from "./Api";
import type { Combustible } from "../types/Combustible";

// ===============================
// OBTENER CARGAS
// ===============================

export const obtenerCargas = async () => {
  const response = await api.get("/combustible");
  return response.data;
};

// ===============================
// OBTENER UNA CARGA
// ===============================

export const obtenerCarga = async (id: string) => {
  const response = await api.get(`/combustible/${id}`);
  return response.data;
};

// ===============================
// CREAR CARGA
// ===============================

export const crearCarga = async (
  data: Combustible
) => {
  const response = await api.post(
    "/combustible",
    data
  );

  return response.data;
};

// ===============================
// ACTUALIZAR CARGA
// ===============================

export const actualizarCarga = async (
  id: string,
  data: Combustible
) => {
  const response = await api.put(
    `/combustible/${id}`,
    data
  );

  return response.data;
};

// ===============================
// ELIMINAR CARGA
// ===============================

export const eliminarCarga = async (
  id: string
) => {
  const response = await api.delete(
    `/combustible/${id}`
  );

  return response.data;
};