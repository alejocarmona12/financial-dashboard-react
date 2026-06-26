import api from "./Api";

export const getFuelExpenses = async () => {
  const response = await api.get("/fuel");
  return response.data;
};

export const createFuelExpense = async (data: any) => {
  const response = await api.post("/fuel", data);
  return response.data;
};