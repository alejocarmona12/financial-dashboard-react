import { Request, Response } from "express";
import Orden from "../Models/Orden";

// Crear una nueva orden
export const crearOrden = async (req: Request, res: Response) => {
  try {
    const nuevaOrden = new Orden(req.body);

    await nuevaOrden.save();

    res.status(201).json({
      message: "Orden creada correctamente",
      orden: nuevaOrden,
    });
  } catch (error: any) {
    console.error("ERROR COMPLETO:");
    console.error(error);
  
    res.status(500).json({
      message: error.message,
      error,
    });
  }
};

// Obtener todas las órdenes
export const obtenerOrdenes = async (
  req: Request,
  res: Response
) => {
  
  try {
    const ordenes = await Orden.find().sort({
      createdAt: -1,
    });
    

    res.json(ordenes);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las órdenes",
    });
  }
};
// Actualizar una orden
export const actualizarOrden = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const ordenActualizada =
      await Orden.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!ordenActualizada) {
      return res.status(404).json({
        message: "Orden no encontrada",
      });
    }

    res.json({
      message: "Orden actualizada correctamente",
      orden: ordenActualizada,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al actualizar la orden",
    });
  }
};
// Eliminar una orden
export const eliminarOrden = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const orden = await Orden.findByIdAndDelete(id);

    if (!orden) {
      return res.status(404).json({
        message: "Orden no encontrada",
      });
    }

    res.json({
      message: "Orden eliminada correctamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al eliminar la orden",
    });
  }
};