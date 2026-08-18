import api from "./Api";

export interface DashboardSummary {
  facturasPendientes: number;
  ordenesPendientes: number;
  combustibleMes: number;
  cobradoMes: number;
}

export const obtenerResumenDashboard = async (): Promise<DashboardSummary> => {
  const response = await api.get<DashboardSummary>("/dashboard");

  return response.data;
};
