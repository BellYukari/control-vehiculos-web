import { NavLink } from "react-router-dom";

function Navbar({ theme, onToggleTheme }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-circle">
          <i className="pi pi-car"></i>
        </div>

        <div>
          <h2>Control</h2>
          <span>Vehicular</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/dashboard">
          <i className="pi pi-home"></i>
          <span>Inicio</span>
        </NavLink>

        <NavLink to="/vehiculos">
          <i className="pi pi-truck"></i>
          <span>Vehículos</span>
        </NavLink>

        <NavLink to="/movimientos">
          <i className="pi pi-sign-in"></i>
          <span>Entradas / Salidas</span>
        </NavLink>

        <NavLink to="/consulta">
          <i className="pi pi-search"></i>
          <span>Consulta</span>
        </NavLink>
      </nav>

      <div className="theme-box">
        <button type="button" className="theme-toggle" onClick={onToggleTheme}>
          <i className={theme === "dark" ? "pi pi-sun" : "pi pi-moon"}></i>
          <span>{theme === "dark" ? "Modo claro" : "Modo oscuro"}</span>
        </button>
      </div>

      <div className="sidebar-footer">
        <i className="pi pi-database"></i>
        <span>Prueba Técnica</span>
      </div>
    </aside>
  );
}

export default Navbar;