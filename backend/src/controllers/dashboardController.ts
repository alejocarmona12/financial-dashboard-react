import { Request, Response } from "express";
import Orden from "../Models/Orden";
import Combustible from "../Models/Combustible";
import Transaction from "../Models/Transaction";

export const obtenerResumenDashboard = async (
  _req: Request,
  res: Response
) => {
  try {
    const ahora = new Date();
    const inicioMes = new Date(
      ahora.getFullYear(),
      ahora.getMonth(),
      1
    );
    const inicioProximoMes = new Date(
      ahora.getFullYear(),
      ahora.getMonth() + 1,
      1
    );

    const [estadosOrdenes, combustible, cobrosOrdenes, ingresosManuales] =
      await Promise.all([
        Orden.aggregate<{
          _id: string;
          cantidad: number;
        }>([
          {
            $match: {
              estado: {
                $in: ["Facturada", "Pendiente", "Cobrada"],
              },
            },
          },
          {
            $group: {
              _id: "$estado",
              cantidad: { $sum: 1 },
            },
          },
        ]),
        Combustible.aggregate<{
          total: number;
          litros: number;
        }>([
          {
            $match: {
              fecha: { $gte: inicioMes, $lt: inicioProximoMes },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$total" },
              litros: { $sum: "$litros" },
            },
          },
        ]),
        Orden.aggregate<{
          total: number;
        }>([
          {
            $match: {
              estado: "Cobrada",
              fechaCobro: {
                $gte: inicioMes,
                $lt: inicioProximoMes,
              },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$total" },
            },
          },
        ]),
        Transaction.aggregate<{
          _id: "income" | "expense";
          total: number;
        }>([
          { $match: { type: { $in: ["income", "expense"] } } },
          {
            $set: {
              fechaTransaccion: {
                $convert: {
                  input: "$date",
                  to: "date",
                  onError: null,
                  onNull: null,
                },
              },
            },
          },
          {
            $match: {
              fechaTransaccion: {
                $gte: inicioMes,
                $lt: inicioProximoMes,
              },
            },
          },
          {
            $group: {
              _id: "$type",
              total: { $sum: "$amount" },
            },
          },
        ]),
      ]);

    const cantidadesPorEstado = estadosOrdenes.reduce(
      (acumulado, item) => ({
        ...acumulado,
        [item._id]: item.cantidad,
      }),
      {} as Record<string, number>
    );

    const facturasPendientes = cantidadesPorEstado.Facturada ?? 0;
    const ordenesPendientes = cantidadesPorEstado.Pendiente ?? 0;
    const combustibleMes = combustible[0]?.total ?? 0;
    const litrosConsumidos = combustible[0]?.litros ?? 0;
    const cobrosOrdenesMes = cobrosOrdenes[0]?.total ?? 0;
    const totalesTransacciones = ingresosManuales.reduce(
      (acumulado, item) => ({
        ...acumulado,
        [item._id]: item.total,
      }),
      {} as Record<"income" | "expense", number>
    );
    const ingresosManualesMes = totalesTransacciones.income ?? 0;
    const gastosManuales = totalesTransacciones.expense ?? 0;
    const cobradoMes = cobrosOrdenesMes + ingresosManualesMes;
    const balance = cobradoMes - combustibleMes - gastosManuales;

    res.json({
      facturasPendientes,
      ordenesPendientes,
      combustibleMes,
      cobradoMes,
      ingresos: cobrosOrdenesMes,
      gastoCombustible: combustibleMes,
      litrosConsumidos,
      ingresosManuales: ingresosManualesMes,
      gastosManuales,
      balance,
      ordenesCobradas: cantidadesPorEstado.Cobrada ?? 0,
      cobrosOrdenesMes,
      ingresosManualesMes,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener el dashboard",
    });
  }
};
