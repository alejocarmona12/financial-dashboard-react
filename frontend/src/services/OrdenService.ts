import api from "./Api";
import type { Orden } from "../types/Orden";

// ==============================
// OBTENER TODAS LAS ÓRDENES
// ==============================

export const obtenerOrdenes = async (): Promise<Orden[]> => {
  const response = await api.get("/ordenes");

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

  if (orden.fechaCobro) {
    formData.append("fechaCobro", orden.fechaCobro);
  }

  // PDF de la Orden de Compra
  if (orden.archivo instanceof File) {
    formData.append("archivo", orden.archivo);
  }

  // Si al crear la orden también se carga una factura
  if (orden.factura instanceof File) {
    formData.append("factura", orden.factura);
  }

  const response = await api.post("/ordenes", formData);

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

  if (orden.fechaCobro) {
    formData.append("fechaCobro", orden.fechaCobro);
  }

  // Solo actualizar el PDF de la Orden de Compra
  if (orden.archivo instanceof File) {
    formData.append("archivo", orden.archivo);
  }

  // IMPORTANTE:
  // La factura NO se envía desde aquí.
  // Se sube mediante subirFactura().

  const response = await api.put(
    `/ordenes/${id}`,
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
  await api.delete(`/ordenes/${id}`);
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

  const response = await api.put(
    `/ordenes/${id}/factura`,
    formData
  );

  return response.data;
};
