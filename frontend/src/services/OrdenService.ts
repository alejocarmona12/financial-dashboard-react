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
  const formData = new FormData();

  formData.append("numero", orden.numero);
  formData.append("cliente", orden.cliente);
  formData.append("fecha", orden.fecha);
  formData.append("estado", orden.estado);
  formData.append(
    "total",
    orden.total.toString()
  );
  formData.append(
    "descripcion",
    orden.descripcion
  );

  if (orden.archivo) {
    formData.append(
      "archivo",
      orden.archivo
    );
  }
  if (orden.factura instanceof File) {
    formData.append(
      "factura",
      orden.factura
    );
  }

  const response = await axios.post(
    API,
    formData
  );

  return response.data.orden;
};
export const actualizarOrden = async (
  id: string,
  orden: Orden
): Promise<Orden> => {
  const formData = new FormData();

  formData.append("numero", orden.numero);
  formData.append("cliente", orden.cliente);
  formData.append("fecha", orden.fecha);
  formData.append("estado", orden.estado);
  formData.append(
    "total",
    orden.total.toString()
  );
  formData.append(
    "descripcion",
    orden.descripcion
  );

  // Solo enviar el archivo si el usuario seleccionó uno nuevo
  if (orden.archivo instanceof File) {
    formData.append(
      "archivo",
      orden.archivo
    );
  }
  if (orden.factura instanceof File) {
    formData.append(
      "factura",
      orden.factura
    );
  }

  const response = await axios.put(
    `${API}/${id}`,
    formData
  );

  return response.data.orden;
};
export const eliminarOrden = async (
  id: string
): Promise<void> => {
  await axios.delete(`${API}/${id}`);
};