export interface FuelExpense {
    _id?: string;
    date: string;
    vehicle: string;
    liters: number;
    pricePerLiter: number;
    total: number;
    type: "camioneta" | "tractor" | "maquina";
    notes?: string;
  }