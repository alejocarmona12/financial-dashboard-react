import { useEffect, useState } from "react";
import api from "../services/Api";

export interface Transaction {
  id: string | undefined;
  _id?: string;

  title: string;
  amount: number;

  type: "income" | "expense";

  category: string;

  description?: string;
  date?: string;
  hasIVA?: boolean;
}

export function useTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
  
    const getTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
  
        const response = await api.get("/transactions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setTransactions(response.data);
      } catch (error) {
        console.error("Error al obtener transacciones:", error);
      }
    };
    const addTransaction = async (
        transaction: Transaction
      ) => {
        try {
          const token = localStorage.getItem("token");
      
          const response = await api.post(
            "/transactions",
            transaction,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
      
          setTransactions((prev) => [
            response.data,
            ...prev,
          ]);
        } catch (error) {
          console.error("Error al crear transacción:", error);
        }
      };
      const deleteTransaction = async (id: string) => {
        if (!window.confirm("¿Seguro que querés eliminar este movimiento?")) {
          return;
        }
      
        try {
          const token = localStorage.getItem("token");
      
          await api.delete(`/transactions/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          setTransactions((prev) =>
            prev.filter((t) => t._id !== id)
          );
        } catch (error) {
          console.error("Error al eliminar transacción:", error);
        }
      };

    useEffect(() => {
      getTransactions();
    }, []);
  
    return {
        transactions,
        addTransaction,
        deleteTransaction,
      };
    // Acá vamos a seguir agregando funciones
  }