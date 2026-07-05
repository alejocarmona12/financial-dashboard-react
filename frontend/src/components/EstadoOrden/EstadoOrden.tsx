import styles from "./EstadoOrden.module.css";

type Estado =
  | "Pendiente"
  | "Facturada"
  | "Cobrada"
  | "Cancelada";

interface Props {
  estado: Estado;
}

export default function EstadoOrden({ estado }: Props) {
  const className = styles[estado.toLowerCase()];

  return (
    <span className={`${styles.badge} ${className}`}>
      {estado}
    </span>
  );
}