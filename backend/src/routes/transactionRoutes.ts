import { Router } from "express";

import {
  obtenerTransacciones,
  crearTransaccion,
  actualizarTransaccion,
  eliminarTransaccion,
} from "../controllers/transactionController";

const router = Router();

// Obtener todas las transacciones
router.get("/", obtenerTransacciones);

// Crear una nueva transacción
router.post("/", crearTransaccion);

// Actualizar una transacción
router.put("/:id", actualizarTransaccion);

// Eliminar una transacción
router.delete("/:id", eliminarTransaccion);

export default router;