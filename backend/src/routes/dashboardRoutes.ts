import { Router } from "express";
import { obtenerResumenDashboard } from "../controllers/dashboardController";

const router = Router();

router.get("/", obtenerResumenDashboard);

export default router;