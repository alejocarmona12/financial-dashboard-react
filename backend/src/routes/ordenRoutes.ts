import { Router } from "express";

import {
  crearOrden,
  obtenerOrdenes,
  actualizarOrden,
  eliminarOrden,
} from "../controllers/ordenController";

const router = Router();

// Obtener todas las órdenes
router.get("/", obtenerOrdenes);

// Crear una orden
router.post("/", crearOrden);

// Actualizar una orden
router.put("/:id", actualizarOrden);
// eliminar orden 
router.delete("/:id", eliminarOrden);

export default router;