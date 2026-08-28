import { Router } from "express";
import {
  obtenerDetalleFinanciero,
  obtenerResumenDashboard,
} from "../controllers/dashboardController";

const router = Router();

router.get("/financial-breakdown", obtenerDetalleFinanciero);
router.get("/", obtenerResumenDashboard);

export default router;
