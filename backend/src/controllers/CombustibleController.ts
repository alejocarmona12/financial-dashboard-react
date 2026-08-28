import { Request, Response } from "express";
import Combustible from "../Models/Combustible";
import {
  deleteSourceMovement,
  syncCombustibleMovement,
} from "../services/financialMovementService";

// ===============================
// OBTENER TODAS LAS CARGAS
// ===============================

export const obtenerCargas = async (
  req: Request,
  res: Response
) => {
  try {
    const cargas = await Combustible.find().sort({
      fecha: -1,
    });

    res.json(cargas);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener las cargas.",
    });
  }
};

// ===============================
// OBTENER UNA CARGA
// ===============================

export const obtenerCarga = async (
  req: Request,
  res: Response
) => {
  try {
    const carga = await Combustible.findById(
      req.params.id
    );

    if (!carga) {
      return res.status(404).json({
        message: "Carga no encontrada.",
      });
    }

    res.json(carga);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener la carga.",
    });
  }
};

// ===============================
// CREAR CARGA
// ===============================

export const crearCarga = async (
  req: Request,
  res: Response
) => {
  try {
    const nuevaCarga = new Combustible(req.body);

    await nuevaCarga.save();
    await syncCombustibleMovement(nuevaCarga);

    res.status(201).json(nuevaCarga);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al crear la carga.",
    });
  }
};

// ===============================
// ACTUALIZAR CARGA
// ===============================

export const actualizarCarga = async (
  req: Request,
  res: Response
) => {
  try {
    const carga = await Combustible.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!carga) {
      return res.status(404).json({
        message: "Carga no encontrada.",
      });
    }

    await syncCombustibleMovement(carga);

    res.json(carga);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al actualizar la carga.",
    });
  }
};

// ===============================
// ELIMINAR CARGA
// ===============================

export const eliminarCarga = async (
  req: Request,
  res: Response
) => {
  try {
    const carga = await Combustible.findByIdAndDelete(
      req.params.id
    );

    if (!carga) {
      return res.status(404).json({
        message: "Carga no encontrada.",
      });
    }

    await deleteSourceMovement("combustible", carga._id);

    res.json({
      message: "Carga eliminada correctamente.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al eliminar la carga.",
    });
  }
};
