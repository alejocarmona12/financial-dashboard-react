import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Facturacion from "./pages/Facturacion";
import DetalleFacturas from "./pages/Detalle-factura";
import ProyectoEndesarrollo from "./pages/Proyecto-en-desarrolo";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* DASHBOARD PROTEGIDO */}
        <Route
          path="/dashboard"
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/" />}
        />

        {/* FACTURACIÓN */}
        <Route
          path="/facturacion"
          element={isAuthenticated() ? <Facturacion /> : <Navigate to="/" />}
        />

        {/* FACTURAS */}
        <Route
          path="/facturas"
          element={
            isAuthenticated() ? <DetalleFacturas /> : <Navigate to="/" />
          }
        />

        {/* PROYECTO */}
        <Route
          path="/proyecto-en-desarrolo"
          element={<ProyectoEndesarrollo />}
        />

        {/* DEFAULT */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
