export interface Combustible {
  _id?: string;

  fecha: string;

  tipo: "camioneta" | "tractor" | "maquina";

  equipo: string;

  operador: string;

  litros: number;

  precioLitro: number;

  total: number;

  observaciones?: string;

  createdAt?: string;

  updatedAt?: string;
}