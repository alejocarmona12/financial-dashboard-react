import { Request, Response } from "express";
import Orden from "../Models/Orden";

// Crear una nueva orden
export const crearOrden = async (req: Request, res: Response) => {
  try {
    const files = req.files as {
      [key: string]: Express.Multer.File[];
    };
    
    const datos = {
      ...req.body,
    
      archivo: files?.archivo?.[0]?.filename || null,
    
      factura: files?.factura?.[0]?.filename || null,
    };
    
    const nuevaOrden = new Orden(datos);

    await nuevaOrden.save();

    res.status(201).json({
      message: "Orden creada correctamente",
      orden: nuevaOrden,
    });
  } catch (error: any) {
    console.log(" ERROR ");
    console.log(error);
  
    res.status(500).json({
      message: error.message,
      error,
    });
  }
}

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

    const files = req.files as {
      [key: string]: Express.Multer.File[];
    };
    
    const datosActualizados: any = {
      ...req.body,
    };
    
    if (files?.archivo?.length) {
      datosActualizados.archivo =
        files.archivo[0].filename;
    }
    
    if (files?.factura?.length) {
      datosActualizados.factura =
        files.factura[0].filename;
    }
    
    const ordenActualizada =
      await Orden.findByIdAndUpdate(
        id,
        datosActualizados,
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