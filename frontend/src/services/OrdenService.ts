import axios from "axios";
import type { Orden } from "../types/Orden";

const API = "http://localhost:4000/api/ordenes";

export const obtenerOrdenes = async (): Promise<Orden[]> => {
  const response = await axios.get(API);

  return response.data;
};

export const crearOrden = async (
  orden: Orden
): Promise<Orden> => {
  const response = await axios.post(
    API,
    orden
  );

  return response.data.orden;
};
export const actualizarOrden = async (
  id: string,
  orden: Orden
): Promise<Orden> => {
  const response = await axios.put(
    `${API}/${id}`,
    orden
  );

return response.data.orden;
};

export const eliminarOrden = async (
  id: string
) => {
  await axios.delete(`${API}/${id}`);
};