import api from "./Api";
import type { FinancialRecord } from "../types/FinancialRecord";

export interface DashboardSummary {
  facturasPendientes: number;
  ordenesPendientes: number;
  combustibleMes: number;
  cobradoMes: number;
  ingresos: number;
  gastos: number;
  balance: number;
  gananciaOPerdida: number;
  ordenesCobradas: number;
  litrosConsumidos: number;
}

export const obtenerResumenDashboard = async (
  month: string
): Promise<DashboardSummary> => {
  const response = await api.get<DashboardSummary>("/dashboard", {
    params: { month },
  });

  return response.data;
};

export const obtenerDetalleFinanciero = async (): Promise<FinancialRecord[]> => {
  const response = await api.get<FinancialRecord[]>("/dashboard/financial-breakdown");
  return response.data;
};
