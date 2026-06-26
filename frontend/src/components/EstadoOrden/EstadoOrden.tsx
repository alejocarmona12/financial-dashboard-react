import styles from "./EstadoOrden.module.css";

type Status =
  | "Pendiente"
  | "Facturada"
  | "Cobrada"
  | "Cancelada";

interface Props {
  estado: Status;
}

export default function StatusBadge({ estado }: Props) {
  const className = styles[estado.toLowerCase()];

  return (
    <span className={`${styles.badge} ${className}`}>
      {estado}
    </span>
  );
}