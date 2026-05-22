import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../services/Api";
import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Detiene la recarga de la página

    // Alerta de control: si no sale este cartel, el HTML está bloqueando la función
    alert("Intentando conectar con el servidor...");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      // Guardamos credenciales
      localStorage.setItem("token", response.data.token);
      const sessionData = { email: email, token: response.data.token };
      localStorage.setItem("auth", JSON.stringify(sessionData));

      // Navegamos al panel principal
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
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1>Iniciar Sesión</h1>
          <p>Ingresá al panel de control financiero</p>
        </div>

        {/* El evento onSubmit DEBE estar estrictamente en la etiqueta form */}
        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </div>

          {/* Botón nativo de envío - gatilla el onSubmit del formulario */}
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
