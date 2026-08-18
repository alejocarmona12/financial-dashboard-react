import api from "./Api";
import type { NewTransaction, Transaction } from "../types/Transaction";

// ===============================
// OBTENER
// ===============================

export const obtenerTransacciones = async () => {
  const response = await api.get("/transactions");
  return response.data;
};

// ===============================
// CREAR
// ===============================

export const crearTransaccion = async (
  data: NewTransaction
) => {
  const response = await api.post(
    "/transactions",
    data
  );

  return response.data;
};

// ===============================
// ACTUALIZAR
// ===============================

export const actualizarTransaccion = async (
  id: string,
  data: Transaction
) => {
  const response = await api.put(
    `/transactions/${id}`,
    data
  );

  return response.data;
};

// ===============================
// ELIMINAR
// ===============================

export const eliminarTransaccion = async (
  id: string
) => {
  const response = await api.delete(
    `/transactions/${id}`
  );

  return response.data;
};
