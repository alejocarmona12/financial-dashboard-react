import type { Types } from "mongoose";
import Transaction from "../Models/Transaction";

type FinancialSource = "orden" | "combustible";

interface SourceMovement {
  _id: Types.ObjectId;
  date: Date;
  amount: number;
  title: string;
  category: string;
  description: string;
  type: "income" | "expense";
}

const toTransactionDate = (date: Date) => date.toISOString().slice(0, 10);

const syncMovement = async (
  sourceType: FinancialSource,
  movement: SourceMovement
) => {
  await Transaction.findOneAndUpdate(
    { sourceType, sourceId: movement._id },
    {
      title: movement.title,
      amount: movement.amount,
      type: movement.type,
      category: movement.category,
      description: movement.description,
      date: toTransactionDate(movement.date),
      hasIVA: false,
      sourceType,
      sourceId: movement._id,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

export const syncCombustibleMovement = async (carga: {
  _id: Types.ObjectId;
  fecha: Date;
  total: number;
  equipo: string;
  operador: string;
}) =>
  syncMovement("combustible", {
    _id: carga._id,
    date: carga.fecha,
    amount: carga.total,
    title: `Combustible · ${carga.equipo}`,
    category: "Combustible",
    description: `Carga registrada para ${carga.equipo} (${carga.operador})`,
    type: "expense",
  });

export const syncOrdenMovement = async (orden: {
  _id: Types.ObjectId;
  estado: string;
  fechaCobro?: Date | null;
  total: number;
  numero: string;
  cliente: string;
}) => {
  if (orden.estado !== "Cobrada" || !orden.fechaCobro) {
    await Transaction.deleteOne({ sourceType: "orden", sourceId: orden._id });
    return;
  }

  await syncMovement("orden", {
    _id: orden._id,
    date: orden.fechaCobro,
    amount: orden.total,
    title: `Cobro orden ${orden.numero}`,
    category: "Órdenes cobradas",
    description: `Cobro de ${orden.cliente}`,
    type: "income",
  });
};

export const deleteSourceMovement = async (
  sourceType: FinancialSource,
  sourceId: Types.ObjectId
) => {
  await Transaction.deleteOne({ sourceType, sourceId });
};
