import {
  BarChart3,
  FileText,
  Fuel,
  LayoutDashboard,
  LogOut,
  ReceiptText,
  WalletCards,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";

const navigation = [
  { to: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/ordenes-compra", label: "Órdenes", Icon: FileText },
  { to: "/facturacion", label: "Facturación", Icon: ReceiptText },
  { to: "/gastos-combustible", label: "Combustible", Icon: Fuel },
  { to: "/facturas", label: "Detalle de IVA", Icon: WalletCards },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  return (
    <aside className={styles.sidebar}>
      <NavLink to="/dashboard" className={styles.brand}>
        <span className={styles.brandMark}><BarChart3 size={21} /></span>
        <span>ContaFlow</span>
      </NavLink>

      <div className={styles.caption}>Gestión</div>
      <nav className={styles.navigation} aria-label="Navegación principal">
        {navigation.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}
          >
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.help}>
          <span>Datos conectados</span>
          <strong>MongoDB activo</strong>
        </div>
        <button className={styles.logout} type="button" onClick={logout}>
          <LogOut size={18} /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
