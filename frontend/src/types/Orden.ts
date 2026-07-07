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

  
  archivo?: File | string | null;

  factura?: File | string | null;

  fechaFactura?: string;

  fechaCobro?: string;

  createdAt?: string;

  updatedAt?: string;
}