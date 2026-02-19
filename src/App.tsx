import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Facturacion from "./pages/facturacion";
import DetalleFacturas from "./pages/detalle-factura";
import ProyectoEndesarrollo from "./pages/proyecto-en-desarrolo";

const isAuthenticated = () => {
  return localStorage.getItem("auth") === "true";
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route path="*" element={<Navigate to="/" />} />

        <Route path="/facturacion" element={<Facturacion />} />
        <Route path="/facturas" element={<DetalleFacturas />} />
        <Route
          path="/proyecto-endesarrollo"
          element={<ProyectoEndesarrollo />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
