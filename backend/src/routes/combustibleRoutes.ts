import { Router } from "express";

import {
  obtenerCargas,
  obtenerCarga,
  crearCarga,
  actualizarCarga,
  eliminarCarga,
} from "../controllers/CombustibleController";

const router = Router();

// Obtener todas las cargas
router.get("/", obtenerCargas);

// Obtener una carga por ID
router.get("/:id", obtenerCarga);

// Crear una carga
router.post("/", crearCarga);

// Actualizar una carga
router.put("/:id", actualizarCarga);

// Eliminar una carga
router.delete("/:id", eliminarCarga);

export default router;