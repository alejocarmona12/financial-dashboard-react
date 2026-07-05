import styles from "./ResumenCard.module.css";

interface ResumenCardProps {
  titulo: string;
  valor: string | number;
  color?: string;
}

export default function ResumenCard({
  titulo,
  valor,
  color = "#00f0ff",
}: ResumenCardProps) {
  return (
    <div className={styles.card}>
      <h4>{titulo}</h4>

      <h2 style={{ color }}>
        {valor}
      </h2>
    </div>
  );
}