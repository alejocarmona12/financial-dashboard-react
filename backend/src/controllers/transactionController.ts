import { Request, Response } from "express";
import Transaction from "../Models/Transaction";

// ===============================
// OBTENER TODAS LAS TRANSACCIONES
// ===============================

export const obtenerTransacciones = async (
  _req: Request,
  res: Response
) => {
  try {
    const transacciones = await Transaction.find().sort({
      date: -1,
    });

    res.json(transacciones);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener las transacciones",
    });
  }
};

// ===============================
// CREAR TRANSACCIÓN
// ===============================

export const crearTransaccion = async (
  req: Request,
  res: Response
) => {
  try {
    const transaccion = new Transaction(req.body);

    await transaccion.save();

    res.status(201).json(transaccion);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al crear la transacción",
    });
  }
};

// ===============================
// ACTUALIZAR TRANSACCIÓN
// ===============================

export const actualizarTransaccion = async (
  req: Request,
  res: Response
) => {
  try {
    const transaccion =
      await Transaction.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    if (!transaccion) {
      return res.status(404).json({
        message: "Transacción no encontrada",
      });
    }

    res.json(transaccion);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al actualizar la transacción",
    });
  }
};

// ===============================
// ELIMINAR TRANSACCIÓN
// ===============================

export const eliminarTransaccion = async (
  req: Request,
  res: Response
) => {
  try {
    const transaccion =
      await Transaction.findByIdAndDelete(req.params.id);

    if (!transaccion) {
      return res.status(404).json({
        message: "Transacción no encontrada",
      });
    }

    res.json({
      message: "Transacción eliminada correctamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al eliminar la transacción",
    });
  }
};