import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../services/Api";
import styles from "./Login.module.css"; // Importación correcta como CSS Module

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      // 1. Guardamos el token para las peticiones HTTP
      localStorage.setItem("token", response.data.token);

      // 2. CORRECCIÓN CLAVE: Guardamos el estado de auth con el email para separar las transacciones
      const sessionData = { email: email, token: response.data.token };
      localStorage.setItem("auth", JSON.stringify(sessionData));

      navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Error al iniciar sesión");
      } else {
        alert("Ocurrió un error inesperado");
      }
    }
  };

  return (
    // Reemplazamos la etiqueta <a> por un <div> común para el contenedor principal
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1>Iniciar Sesión</h1>
          <p>Ingresá al panel de control financiero</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className={styles.btnAuth}>
            Ingresar
          </button>
        </form>

        <div className={styles.authFooter}>
          <p>¿No tenés cuenta?</p>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => navigate("/register")}
          >
            Crear cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
