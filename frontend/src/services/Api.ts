import axios from "axios";

// Detecta automáticamente si estás en Netlify o en tu computadora
const API_URL = import.meta.env.PROD 
  ? "https://onrender.com" // REEMPLAZÁ ESTO con la URL de tu Backend desplegado
  : "http://localhost:4000/api"; 

const api = axios.create({
  baseURL: API_URL,
});

export default api;
