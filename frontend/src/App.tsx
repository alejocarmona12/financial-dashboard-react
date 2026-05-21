import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Facturacion from "./pages/Facturacion";
import DetalleFacturas from "./pages/Detalle-factura";
// import ProyectoEndesarrollo from "./pages/Proyecto-en-desarrolo";
import Register from "./pages/Register";

// Componente protector dinámico que lee el almacenamiento en cada navegación
const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  // Si hay token, permite el acceso a las subrutas hijas (Outlet). Si no, redirige.
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
        // path="/proyecto-en-desarrolo"
        // element={<ProyectoEndesarrollo />}
        />

        {/* RUTAS PROTEGIDAS (Agrupadas dentro del protector) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/facturacion" element={<Facturacion />} />
          <Route path="/facturas" element={<DetalleFacturas />} />
        </Route>

        {/* REDIRECCIÓN POR DEFECTO */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
