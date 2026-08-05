import styles from "./ActionsSection.module.css";
import QuickActions from "../Dashboard/QuickActions/QuickActions";

interface Props {
  onNuevoMovimiento: () => void;
}

export default function ActionsSection({
  onNuevoMovimiento,
}: Props) {
  return (
    <section className={styles.container}>
      <QuickActions
        onNuevoMovimiento={onNuevoMovimiento}
      />
    </section>
  );
}