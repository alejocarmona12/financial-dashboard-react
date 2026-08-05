import {
    ArrowDownCircle,
    ArrowUpCircle,
    FileText,
    Fuel,
  } from "lucide-react";
  
  import styles from "./RecentActivity.module.css";
  
  interface Activity {
    id: number;
    type: "income" | "expense" | "invoice" | "fuel";
    title: string;
    time: string;
  }
  
  const activities: Activity[] = [
    {
      id: 1,
      type: "income",
      title: "Ingreso registrado",
      time: "Hace 5 minutos",
    },
    {
      id: 2,
      type: "expense",
      title: "Nuevo gasto",
      time: "Hace 25 minutos",
    },
    {
      id: 3,
      type: "invoice",
      title: "Factura emitida",
      time: "Hace 1 hora",
    },
    {
      id: 4,
      type: "fuel",
      title: "Carga de combustible",
      time: "Hace 2 horas",
    },
  ];
  
  export default function RecentActivity() {
    const getIcon = (type: Activity["type"]) => {
      switch (type) {
        case "income":
          return <ArrowUpCircle size={22} />;
        case "expense":
          return <ArrowDownCircle size={22} />;
        case "invoice":
          return <FileText size={22} />;
        case "fuel":
          return <Fuel size={22} />;
      }
    };
  
    return (
      <section className={styles.container}>
        <h2>Actividad reciente</h2>
  
        <div className={styles.list}>
          {activities.map((activity) => (
            <div key={activity.id} className={styles.item}>
              <div className={styles.icon}>
                {getIcon(activity.type)}
              </div>
  
              <div className={styles.info}>
                <strong>{activity.title}</strong>
                <span>{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }