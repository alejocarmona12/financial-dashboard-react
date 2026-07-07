import { Router } from "express";
import upload from "../middleware/upload";

import {
  crearOrden,
  obtenerOrdenes,
  actualizarOrden,
} from "../controllers/ordenController";

const router = Router();

// Obtener todas las órdenes
router.get("/", obtenerOrdenes);

// Crear una orden con archivos
router.post(
  "/",
  upload.fields([
    { name: "archivo", maxCount: 1 },
    { name: "factura", maxCount: 1 },
  ]),
  crearOrden
);

// Actualizar una orden con archivos
router.put(
  "/:id",
  upload.fields([
    { name: "archivo", maxCount: 1 },
    { name: "factura", maxCount: 1 },
  ]),
  actualizarOrden
);

export default router;