import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../services/Api";
import styles from "./Login.module.css"; // REUTILIZAMOS EL MISMO MÓDULO DEL LOGIN

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { name, email, password });
      alert("Cuenta creada con éxito. Ya podés iniciar sesión.");
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Error al registrarse");
      } else {
        alert("Ocurrió un error inesperado");
      }
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1>Crear Cuenta </h1>
          <p>Registrate para empezar a gestionar tus finanzas</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nombre</label>
            <input
              id="name"
              type="text"
              placeholder="Tu nombre"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
            Crear cuenta
          </button>
        </form>

        <div className={styles.authFooter}>
          <p>¿Ya tienes cuenta?</p>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => navigate("/")}
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
