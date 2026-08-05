import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import errorMiddleware from "./middleware/errorMiddleware";
import ordenRoutes from "./routes/ordenRoutes"; 
import path from "path";
import combustibleRoutes from "./routes/combustibleRoutes";
import  transactionRoutes from "./routes/transactionRoutes";

dotenv.config();
console.log(process.env.MONGO_URI);

const app = express();   

// 1. CONFIGURACIÓN BASE DE CORS
app.use(
  cors({
    origin: "*", // Permite el acceso libre desde tu dominio de Netlify
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// 2. FUNCIÓN DE MIDDLEWARE TRADICIONAL PARA RESPONDER A PREFLIGHT (Solución definitiva para Express 5)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  // Si la petición es un chequeo previo (OPTIONS), respondemos directo con un estado 200 sin pasar por el enrutador
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

app.use(express.json());
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "src/uploads"))
);
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/ordenes", ordenRoutes);
app.use("/api/combustible", combustibleRoutes);


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
