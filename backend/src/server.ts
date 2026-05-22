import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import errorMiddleware from "./middleware/errorMiddleware";

dotenv.config();
console.log(process.env.MONGO_URI);

const app = express();   

// 1. CONFIGURACIÓN ROBUSTA DE CORS PARA PRODUCCIÓN 
app.use(
  cors({
    origin: "*", // Permite el acceso libre desde tu dominio de Netlify
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// CORRECCIÓN EXPRESS 5: Sintaxis correcta con paréntesis para comodín global
app.options("(*)", cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

app.get("/", (_req, res) => {
  res.send("API funcionando correctamente");
});

app.use(errorMiddleware);

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("MongoDB conectado");

    app.listen(process.env.PORT, () => {
      console.log(`Servidor puerto ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
