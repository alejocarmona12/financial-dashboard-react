import { Request, Response } from "express";
import Combustible from "../Models/Combustible";
import Orden from "../Models/Orden";
import Transaction from "../Models/Transaction";

const getPeriod = (monthQuery: unknown) => {
  if (monthQuery === "all") return {};

  const month = Number(monthQuery);
  if (!Number.isInteger(month) || month < 0 || month > 11) {
    const now = new Date();
    return {
      start: new Date(now.getFullYear(), now.getMonth(), 1),
      end: new Date(now.getFullYear(), now.getMonth() + 1, 1),
    };
  }

  const year = new Date().getFullYear();
  return {
    start: new Date(year, month, 1),
    end: new Date(year, month + 1, 1),
  };
};

const withoutLinkedMovement = (sourceType: "orden" | "combustible") => [
  {
    $lookup: {
      from: "transactions",
      let: { sourceId: "$_id" },
      pipeline: [
        {
          $match: {
            sourceType,
            $expr: { $eq: ["$sourceId", "$$sourceId"] },
          },
        },
      ],
      as: "financialMovement",
    },
  },
  { $match: { financialMovement: { $eq: [] } } },
];

const toDateString = (date: Date) => date.toISOString().slice(0, 10);

export const obtenerDetalleFinanciero = async (_req: Request, res: Response) => {
  try {
    const [transactions, ordenes, cargas] = await Promise.all([
      Transaction.find().sort({ date: -1 }),
      Orden.find({ estado: "Cobrada", fechaCobro: { $exists: true } }),
      Combustible.find(),
    ]);

    const linkedOrderIds = new Set(
      transactions
        .filter((transaction) => transaction.sourceType === "orden" && transaction.sourceId)
        .map((transaction) => transaction.sourceId!.toString())
    );
    const linkedFuelIds = new Set(
      transactions
        .filter((transaction) => transaction.sourceType === "combustible" && transaction.sourceId)
        .map((transaction) => transaction.sourceId!.toString())
    );

    const movements = [
      ...transactions.map((transaction) => ({
        id: transaction._id.toString(),
        date: transaction.date,
        title: transaction.title,
        category: transaction.category,
        origin: transaction.sourceType === "orden"
          ? "Orden cobrada"
          : transaction.sourceType === "combustible"
            ? "Combustible"
            : "Movimiento manual",
        type: transaction.type,
        amount: transaction.amount,
        hasIVA: transaction.hasIVA,
        status: transaction.sourceType === "orden" ? "Cobrada" : undefined,
      })),
      ...ordenes
        .filter((orden) => !linkedOrderIds.has(orden._id.toString()))
        .map((orden) => ({
          id: `orden-${orden._id.toString()}`,
          date: toDateString(orden.fechaCobro!),
          title: `Cobro orden ${orden.numero}`,
          category: "Órdenes cobradas",
          origin: "Orden cobrada",
          type: "income" as const,
          amount: orden.total,
          hasIVA: false,
          status: "Cobrada",
        })),
      ...cargas
        .filter((carga) => !linkedFuelIds.has(carga._id.toString()))
        .map((carga) => ({
          id: `combustible-${carga._id.toString()}`,
          date: toDateString(carga.fecha),
          title: `Combustible · ${carga.equipo}`,
          category: "Combustible",
          origin: "Combustible",
          type: "expense" as const,
          amount: carga.total,
          hasIVA: false,
        })),
    ].sort((a, b) => b.date.localeCompare(a.date));

    res.json(movements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el detalle financiero" });
  }
};

export const obtenerResumenDashboard = async (req: Request, res: Response) => {
  try {
    const period = getPeriod(req.query.month);
    const transactionDateMatch = period.start
      ? { fechaTransaccion: { $gte: period.start, $lt: period.end } }
      : {};
    const orderPaymentMatch = period.start
      ? { fechaCobro: { $gte: period.start, $lt: period.end } }
      : {};
    const fuelDateMatch = period.start
      ? { fecha: { $gte: period.start, $lt: period.end } }
      : {};

    const [orderStates, fuel, transactions, unlinkedOrderPayments, unlinkedFuel] =
      await Promise.all([
        Orden.aggregate<{ _id: string; cantidad: number }>([
          { $match: { estado: { $in: ["Pendiente", "Facturada", "Cobrada"] } } },
          { $group: { _id: "$estado", cantidad: { $sum: 1 } } },
        ]),
        Combustible.aggregate<{ total: number; litros: number }>([
          { $match: fuelDateMatch },
          { $group: { _id: null, total: { $sum: "$total" }, litros: { $sum: "$litros" } } },
        ]),
        Transaction.aggregate<{ _id: "income" | "expense"; total: number }>([
          {
            $set: {
              fechaTransaccion: {
                $convert: { input: "$date", to: "date", onError: null, onNull: null },
              },
            },
          },
          { $match: transactionDateMatch },
          { $group: { _id: "$type", total: { $sum: "$amount" } } },
        ]),
        Orden.aggregate<{ total: number }>([
          { $match: { estado: "Cobrada", ...orderPaymentMatch } },
          ...withoutLinkedMovement("orden"),
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]),
        Combustible.aggregate<{ total: number }>([
          { $match: fuelDateMatch },
          ...withoutLinkedMovement("combustible"),
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]),
      ]);

    const quantities = Object.fromEntries(orderStates.map(({ _id, cantidad }) => [_id, cantidad]));
    const transactionTotals = Object.fromEntries(transactions.map(({ _id, total }) => [_id, total])) as Partial<Record<"income" | "expense", number>>;
    const combustibleMes = fuel[0]?.total ?? 0;
    const ingresos = (transactionTotals.income ?? 0) + (unlinkedOrderPayments[0]?.total ?? 0);
    const gastos = (transactionTotals.expense ?? 0) + (unlinkedFuel[0]?.total ?? 0);

    res.json({
      facturasPendientes: quantities.Facturada ?? 0,
      ordenesPendientes: quantities.Pendiente ?? 0,
      ordenesCobradas: quantities.Cobrada ?? 0,
      combustibleMes,
      litrosConsumidos: fuel[0]?.litros ?? 0,
      cobradoMes: ingresos,
      ingresos,
      gastos,
      balance: ingresos - gastos,
      gananciaOPerdida: ingresos - gastos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el dashboard" });
  }
};
