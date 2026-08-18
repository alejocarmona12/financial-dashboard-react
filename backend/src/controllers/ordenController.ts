import { Request, Response } from "express";
import Orden from "../Models/Orden";

const fechaValida = (fecha: unknown) =>
  typeof fecha === "string" &&
  fecha.trim() !== "" &&
  !Number.isNaN(new Date(fecha).getTime());

// ===============================
// Crear una nueva orden
// ===============================
export const crearOrden = async (
  req: Request,
  res: Response
) => {
  try {
    const files = req.files as {
      [key: string]: Express.Multer.File[];
    };

    const datos = {
      ...req.body,

      archivo:
        files?.archivo?.[0]?.filename || null,

      factura:
        files?.factura?.[0]?.filename || null,
    };

    if (datos.estado === "Cobrada" && !fechaValida(datos.fechaCobro)) {
      return res.status(400).json({
        message: "La fecha de cobro es obligatoria y debe ser válida.",
      });
    }

    const nuevaOrden = new Orden(datos);

    await nuevaOrden.save();

    res.status(201).json({
      message: "Orden creada correctamente",
      orden: nuevaOrden,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      message: error.message,
      error,
    });
  }
};

// ===============================
// Obtener todas las órdenes
// ===============================
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

// ===============================
// Actualizar orden
// ===============================
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

    if (
      datosActualizados.estado === "Cobrada" &&
      !fechaValida(datosActualizados.fechaCobro)
    ) {
      return res.status(400).json({
        message: "La fecha de cobro es obligatoria y debe ser válida.",
      });
    }

    // Solo actualiza el PDF de la Orden de Compra
    if (files?.archivo?.length) {
      datosActualizados.archivo =
        files.archivo[0].filename;
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

// ===============================
// Subir factura
// ===============================
export const subirFactura = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const files = req.files as {
      [key: string]: Express.Multer.File[];
    };

    if (!files?.factura?.length) {
      return res.status(400).json({
        message: "Debe seleccionar un PDF.",
      });
    }

    const orden =
      await Orden.findById(id);

    if (!orden) {
      return res.status(404).json({
        message: "Orden no encontrada.",
      });
    }

    orden.factura =
      files.factura[0].filename;

    orden.fechaFactura =
      req.body.fechaFactura;

    // Cambiar automáticamente el estado
    orden.estado = "Facturada";

    await orden.save();

    res.json({
      message:
        "Factura subida correctamente.",
      orden,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Error al subir la factura.",
    });
  }
};

// ===============================
// Eliminar orden
// ===============================
export const eliminarOrden = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const orden =
      await Orden.findByIdAndDelete(id);

    if (!orden) {
      return res.status(404).json({
        message: "Orden no encontrada",
      });
    }

    res.json({
      message:
        "Orden eliminada correctamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Error al eliminar la orden",
    });
  }
};
