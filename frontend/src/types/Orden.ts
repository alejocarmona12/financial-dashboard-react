export type EstadoOrden =
  | "Pendiente"
  | "Facturada"
  | "Cobrada"
  | "Cancelada";

export interface Orden {
  _id?: string;

  numero: string;

  cliente: string;

  fecha: string;

  estado: EstadoOrden;

  total: number;

  descripcion: string;

  archivo?: File | null;

  factura?: string;

  fechaFactura?: string;

  fechaCobro?: string;

  createdAt?: string;

  updatedAt?: string;
}