import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import VehiculosPage from "./pages/VehiculosPage";
import DashboardPage from "./pages/DashboardPage";
import MovimientosPage from "./pages/MovimientosPage";
import ConsultaMovimientosPage from "./pages/ConsultaMovimientosPage";

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const cambiarTema = () => {
    setTheme((actual) => (actual === "light" ? "dark" : "light"));
  };

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar theme={theme} onToggleTheme={cambiarTema} />

        <main className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/vehiculos" element={<VehiculosPage />} />
            <Route path="/movimientos" element={<MovimientosPage />} />
            <Route path="/consulta" element={<ConsultaMovimientosPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;