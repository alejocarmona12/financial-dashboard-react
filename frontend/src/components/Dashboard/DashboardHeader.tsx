import {
  CalendarDays,
  CircleUserRound,
} from "lucide-react";

import styles from "./DashboardHeader.module.css";

interface Props {
  titulo: string;
  usuario?: string;
}

export default function DashboardHeader({
  titulo,
  usuario = "Usuario",
}: Props) {
  const fecha = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const hora = new Date().getHours();

  let saludo = "";
  
  if (hora < 12) {
    saludo = "🌅 Buenos días";
  } else if (hora < 19) {
    saludo = "☀️ Buenas tardes";
  } else {
    saludo = "🌙 Buenas noches";
  }
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <span className={styles.eyebrow}>Panel financiero</span>
        <h1>{titulo}</h1>
        <p>{saludo}, {usuario}. Consultá el estado de tu negocio en tiempo real.</p>
      </div>

      <div className={styles.right}>
        <div className={styles.item}>
          <CalendarDays size={22} />

          <div className={styles.info}>
            <small>Fecha actual</small>
            <span>{fecha}</span>
          </div>
        </div>

        <div className={styles.item}>
          <CircleUserRound size={22} />

          <div className={styles.info}>
            <small>Sesión activa</small>
            <span>{usuario}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
