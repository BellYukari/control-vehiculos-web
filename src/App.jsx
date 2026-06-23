import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import VehiculosPage from "./pages/VehiculosPage";
import MovimientosPage from "./pages/MovimientosPage";
import ConsultaMovimientosPage from "./pages/ConsultaMovimientosPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main className="main-container">
        <Routes>
          <Route path="/" element={<Navigate to="/vehiculos" />} />
          <Route path="/vehiculos" element={<VehiculosPage />} />
          <Route path="/movimientos" element={<MovimientosPage />} />
          <Route path="/consulta" element={<ConsultaMovimientosPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;