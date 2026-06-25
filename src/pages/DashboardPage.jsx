import { useEffect, useState } from "react";
import { obtenerVehiculos } from "../api/vehiculosApi";
import { obtenerMovimientos } from "../api/movimientosApi";

function DashboardPage() {
  const [vehiculos, setVehiculos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cargarDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [vehiculosResponse, movimientosResponse] = await Promise.all([
        obtenerVehiculos(),
        obtenerMovimientos(),
      ]);

      if (vehiculosResponse.success) {
        setVehiculos(vehiculosResponse.data);
      }

      if (movimientosResponse.success) {
        setMovimientos(movimientosResponse.data);
      }
    } catch (error) {
      console.error("Error al cargar dashboard:", error);
      setError("No se pudo cargar la información del dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDashboard();
  }, []);

  const totalVehiculos = vehiculos.length;

  const vehiculosActivos = vehiculos.filter(
    (vehiculo) => Number(vehiculo.estado) === 1
  ).length;

  const totalEntradas = movimientos.filter(
    (movimiento) => movimiento.tipo_movimiento === "Entrada"
  ).length;

  const totalSalidas = movimientos.filter(
    (movimiento) => movimiento.tipo_movimiento === "Salida"
  ).length;

  const ultimosMovimientos = movimientos.slice(0, 6);

  const formatearFecha = (fecha) => {
    if (!fecha) return "";

    const fechaObj = new Date(fecha);

    if (Number.isNaN(fechaObj.getTime())) {
      return fecha;
    }

    return fechaObj.toLocaleDateString("es-HN");
  };

  const formatearHora = (hora) => {
    if (!hora) return "";
    return String(hora).slice(0, 5);
  };

  return (
    <section className="module-page">
      <div className="module-toolbar">
        <h1>Inicio</h1>

        <div className="toolbar-actions">
          <button
            type="button"
            className="square-btn square-btn-refresh"
            onClick={cargarDashboard}
            disabled={loading}
            title="Refrescar"
          >
            <i className="pi pi-refresh"></i>
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p className="table-empty-message">Cargando información...</p>
      ) : (
        <>
          <div className="dashboard-grid">
            <article className="dashboard-card">
              <div className="dashboard-icon dashboard-icon-primary">
                <i className="pi pi-truck"></i>
              </div>

              <div>
                <span>Total vehículos</span>
                <strong>{totalVehiculos}</strong>
              </div>
            </article>

            <article className="dashboard-card">
              <div className="dashboard-icon dashboard-icon-green">
                <i className="pi pi-check-circle"></i>
              </div>

              <div>
                <span>Vehículos activos</span>
                <strong>{vehiculosActivos}</strong>
              </div>
            </article>

            <article className="dashboard-card">
              <div className="dashboard-icon dashboard-icon-entry">
                <i className="pi pi-sign-in"></i>
              </div>

              <div>
                <span>Total entradas</span>
                <strong>{totalEntradas}</strong>
              </div>
            </article>

            <article className="dashboard-card">
              <div className="dashboard-icon dashboard-icon-exit">
                <i className="pi pi-sign-out"></i>
              </div>

              <div>
                <span>Total salidas</span>
                <strong>{totalSalidas}</strong>
              </div>
            </article>
          </div>

          <div className="dashboard-content">
            <div className="dashboard-panel">
              <div className="dashboard-panel-header">
                <h2>Últimos movimientos</h2>
                <p>Resumen de las entradas y salidas más recientes.</p>
              </div>

              {ultimosMovimientos.length === 0 ? (
                <p className="table-empty-message">
                  No hay movimientos registrados todavía.
                </p>
              ) : (
                <div className="responsive-table">
                  <table className="system-table dashboard-table">
                    <thead>
                      <tr>
                        <th>Vehículo</th>
                        <th>Motorista</th>
                        <th>Tipo</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                      </tr>
                    </thead>

                    <tbody>
                      {ultimosMovimientos.map((movimiento) => (
                        <tr key={movimiento.id}>
                          <td>
                            <strong>{movimiento.vehiculo}</strong>
                            <br />
                            <span className="muted-text">
                              {movimiento.placa}
                            </span>
                          </td>

                          <td>{movimiento.motorista}</td>

                          <td>
                            <span
                              className={
                                movimiento.tipo_movimiento === "Entrada"
                                  ? "movement-badge movement-entry"
                                  : "movement-badge movement-exit"
                              }
                            >
                              {movimiento.tipo_movimiento}
                            </span>
                          </td>

                          <td>{formatearFecha(movimiento.fecha)}</td>
                          <td>{formatearHora(movimiento.hora)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="dashboard-panel dashboard-help">
              <div className="dashboard-panel-header">
                <h2>Estado del sistema</h2>
                <p>Resumen rápido del control vehicular.</p>
              </div>

              <div className="dashboard-help-list">
                <div>
                  <i className="pi pi-car"></i>
                  <span>
                    Vehículos registrados disponibles para movimientos.
                  </span>
                </div>

                <div>
                  <i className="pi pi-filter"></i>
                  <span>
                    Consulta avanzada por rango de fechas, vehículo, motorista y
                    tipo.
                  </span>
                </div>

                <div>
                  <i className="pi pi-moon"></i>
                  <span>
                    Interfaz con modo claro y oscuro.
                  </span>
                </div>

                <div>
                  <i className="pi pi-database"></i>
                  <span>
                    Datos almacenados en MySQL mediante API Node.js.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default DashboardPage;