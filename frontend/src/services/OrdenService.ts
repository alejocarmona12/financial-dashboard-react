import axios from "axios";
import type { Orden } from "../types/Orden";

const API = "http://localhost:4000/api/ordenes";

// ==============================
// OBTENER TODAS LAS ÓRDENES
// ==============================

export const obtenerOrdenes = async (): Promise<Orden[]> => {
  const response = await axios.get(API);

  return response.data;
};

// ==============================
// CREAR ORDEN
// ==============================

export const crearOrden = async (
  orden: Orden
): Promise<Orden> => {
  const formData = new FormData();

  formData.append("numero", orden.numero);
  formData.append("cliente", orden.cliente);
  formData.append("fecha", orden.fecha);
  formData.append("estado", orden.estado);
  formData.append("total", orden.total.toString());
  formData.append("descripcion", orden.descripcion);

  // PDF de la Orden de Compra
  if (orden.archivo instanceof File) {
    formData.append("archivo", orden.archivo);
  }

  // Si al crear la orden también se carga una factura
  if (orden.factura instanceof File) {
    formData.append("factura", orden.factura);
  }

  const response = await axios.post(API, formData);

  return response.data.orden;
};

// ==============================
// ACTUALIZAR ORDEN
// ==============================

export const actualizarOrden = async (
  id: string,
  orden: Orden
): Promise<Orden> => {
  const formData = new FormData();

  formData.append("numero", orden.numero);
  formData.append("cliente", orden.cliente);
  formData.append("fecha", orden.fecha);
  formData.append("estado", orden.estado);
  formData.append("total", orden.total.toString());
  formData.append("descripcion", orden.descripcion);

  // Solo actualizar el PDF de la Orden de Compra
  if (orden.archivo instanceof File) {
    formData.append("archivo", orden.archivo);
  }

  // IMPORTANTE:
  // La factura NO se envía desde aquí.
  // Se sube mediante subirFactura().

  const response = await axios.put(
    `${API}/${id}`,
    formData
  );

  return response.data.orden;
};

// ==============================
// ELIMINAR ORDEN
// ==============================

export const eliminarOrden = async (
  id: string
): Promise<void> => {
  await axios.delete(`${API}/${id}`);
};

// ==============================
// SUBIR FACTURA
// ==============================

export const subirFactura = async (
  id: string,
  archivo: File,
  fecha: string
) => {
  const formData = new FormData();

  formData.append("factura", archivo);
  formData.append("fechaFactura", fecha);

  const response = await axios.put(
    `${API}/${id}/factura`,
    formData
  );

  return response.data;
};