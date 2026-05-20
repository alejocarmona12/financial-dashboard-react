import { Response } from "express";

import Transaction from "../Models/Transaction";
import { AuthRequest } from "../middleware/authMiddleware";

// CREAR TRANSACCIÓN
export const createTransaction = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { title, amount, type, category } = req.body;

    const transaction = await Transaction.create({
      title,
      amount,
      type,
      category,
      user: req.userId,
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error servidor",
    });
  }
};

// OBTENER TRANSACCIONES
export const getTransactions = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const transactions = await Transaction.find({
      user: req.userId,
    }).sort({
      createdAt: -1,
    });

    res.json(transactions);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error servidor",
    });
  }
};

// ACTUALIZAR TRANSACCIÓN
export const updateTransaction = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const transaction = await Transaction.findById(
      req.params.id
    );

    if (!transaction) {
      return res.status(404).json({
        message: "Transacción no encontrada",
      });
    }

    if (transaction.user.toString() !== req.userId) {
      return res.status(401).json({
        message: "No autorizado",
      });
    }

    const updatedTransaction =
      await Transaction.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.json(updatedTransaction);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error servidor",
    });
  }
};

// ELIMINAR TRANSACCIÓN
export const deleteTransaction = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const transaction = await Transaction.findById(
      req.params.id
    );

    if (!transaction) {
      return res.status(404).json({
        message: "Transacción no encontrada",
      });
    }

    if (transaction.user.toString() !== req.userId) {
      return res.status(401).json({
        message: "No autorizado",
      });
    }

    await transaction.deleteOne();

    res.json({
      message: "Transacción eliminada",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error servidor",
    });
  }
};