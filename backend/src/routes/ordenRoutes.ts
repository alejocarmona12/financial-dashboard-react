import { Router } from "express";
import upload from "../middleware/upload";

import {
  crearOrden,
  obtenerOrdenes,
  actualizarOrden,
  subirFactura,
  eliminarOrden,
} from "../controllers/ordenController";

const router = Router();

// Obtener todas las órdenes
router.get("/", obtenerOrdenes);

// Crear una orden
router.post(
  "/",
  upload.fields([
    { name: "archivo", maxCount: 1 },
    { name: "factura", maxCount: 1 },
  ]),
  crearOrden
);

// Actualizar datos de la orden
router.put(
  "/:id",
  upload.fields([
    { name: "archivo", maxCount: 1 },
  ]),
  actualizarOrden
);

// Subir factura
router.put(
  "/:id/factura",
  upload.fields([
    { name: "factura", maxCount: 1 },
  ]),
  subirFactura
);

// Eliminar orden
router.delete("/:id", eliminarOrden);

export default router;