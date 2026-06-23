import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <i className="pi pi-car"></i>
        <span>Control Vehicular</span>
      </div>

      <nav className="navbar-links">
        <NavLink to="/vehiculos">Vehículos</NavLink>
        <NavLink to="/movimientos">Entradas/Salidas</NavLink>
        <NavLink to="/consulta">Consulta</NavLink>
      </nav>
    </header>
  );
}

export default Navbar;