import { useEffect, useState } from "react";

export interface Transaction {
  id: number;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
  hasIVA: boolean;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // 1. Identificar al usuario logueado actualmente de forma segura
  const authData = localStorage.getItem("auth");
  let storageKey = "transactions_guest"; // Clave por defecto por seguridad

  if (authData) {
    try {
      const currentUser = JSON.parse(authData);
      // Usamos el email del usuario para armar una clave única (ej: "transactions_juan@mail.com")
      if (currentUser && currentUser.email) {
        storageKey = `transactions_${currentUser.email}`;
      }
    } catch (e) {
      console.error("Error al parsear los datos de autenticación", e);
    }
  }

  // 2. Cargar desde localStorage usando la clave exclusiva de este usuario
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setTransactions(JSON.parse(saved));
    } else {
      setTransactions([]); // Si el usuario es nuevo, arranca limpio
    }
  }, [storageKey]);

  // 3. Persistir los datos bajo la clave del usuario activo
  const persist = (data: Transaction[]) => {
    setTransactions(data);
    localStorage.setItem(storageKey, JSON.stringify(data));
  };

  const addTransaction = (tx: Transaction) => {
    persist([...transactions, tx]);
  };

  const deleteTransaction = (id: number) => {
    if (!confirm("¿Seguro que querés eliminar este movimiento?")) return;
    persist(transactions.filter((t) => t.id !== id));
  };

  return {
    transactions,
    addTransaction,
    deleteTransaction,
  };
}
