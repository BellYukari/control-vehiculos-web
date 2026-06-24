import { useEffect, useState } from "react";
import { obtenerVehiculos } from "../api/vehiculosApi";
import { obtenerMovimientos, eliminarMovimiento } from "../api/movimientosApi";

function ConsultaMovimientosPage() {
  const filtrosIniciales = {
    fecha: "",
    vehiculo_id: "",
    motorista: "",
  };

  const [vehiculos, setVehiculos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [filtros, setFiltros] = useState(filtrosIniciales);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const cargarVehiculos = async () => {
    try {
      const response = await obtenerVehiculos();

      if (response.success) {
        setVehiculos(response.data);
      }
    } catch (error) {
      console.error("Error al cargar vehículos:", error);
      setError("No se pudieron cargar los vehículos.");
    }
  };

  const cargarMovimientos = async (filtrosAplicados = filtros) => {
    try {
      setLoading(true);
      setError("");

      const filtrosLimpios = {};

      if (filtrosAplicados.fecha) {
        filtrosLimpios.fecha = filtrosAplicados.fecha;
      }

      if (filtrosAplicados.vehiculo_id) {
        filtrosLimpios.vehiculo_id = filtrosAplicados.vehiculo_id;
      }

      if (filtrosAplicados.motorista.trim()) {
        filtrosLimpios.motorista = filtrosAplicados.motorista.trim();
      }

      const response = await obtenerMovimientos(filtrosLimpios);

      if (response.success) {
        setMovimientos(response.data);
      }
    } catch (error) {
      console.error("Error al cargar movimientos:", error);
      setError("No se pudieron cargar los movimientos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarVehiculos();
    cargarMovimientos(filtrosIniciales);
  }, []);

  const handleFiltroChange = (event) => {
    const { name, value } = event.target;

    setFiltros({
      ...filtros,
      [name]: value,
    });
  };

  const buscarMovimientos = (event) => {
    event.preventDefault();
    setMensaje("");
    cargarMovimientos(filtros);
  };

  const limpiarFiltros = () => {
    setFiltros(filtrosIniciales);
    setMensaje("");
    setError("");
    cargarMovimientos(filtrosIniciales);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "";

    const fechaObj = new Date(fecha);

    if (Number.isNaN(fechaObj.getTime())) {
      return fecha;
    }

    return fechaObj.toLocaleDateString("es-HN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatearHora = (hora) => {
    if (!hora) return "";

    return String(hora).slice(0, 5);
  };

  const confirmarEliminar = async (movimiento) => {
    const confirmar = window.confirm(
      `¿Está seguro de eliminar este movimiento de ${movimiento.tipo_movimiento}?`
    );

    if (!confirmar) {
      return;
    }

    try {
      setLoading(true);
      setMensaje("");
      setError("");

      const response = await eliminarMovimiento(movimiento.id);

      if (response.success) {
        setMensaje(response.message);
        await cargarMovimientos(filtros);
      }
    } catch (error) {
      console.error("Error al eliminar movimiento:", error);
      setError(
        error.response?.data?.message || "Error al eliminar el movimiento."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-card">
      <div className="page-header">
        <div>
          <h1>Consulta de Movimientos</h1>
          <p>
            Consulte las entradas y salidas registradas por fecha, vehículo o
            motorista.
          </p>
        </div>
      </div>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <form className="filter-card" onSubmit={buscarMovimientos}>
        <div className="filter-grid">
          <div className="form-group">
            <label>Fecha</label>
            <input
              type="date"
              name="fecha"
              value={filtros.fecha}
              onChange={handleFiltroChange}
            />
          </div>

          <div className="form-group">
            <label>Vehículo</label>
            <select
              name="vehiculo_id"
              value={filtros.vehiculo_id}
              onChange={handleFiltroChange}
            >
              <option value="">Todos los vehículos</option>

              {vehiculos.map((vehiculo) => (
                <option key={vehiculo.id} value={vehiculo.id}>
                  {vehiculo.marca} {vehiculo.modelo} - {vehiculo.placa}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Motorista</label>
            <input
              type="text"
              name="motorista"
              value={filtros.motorista}
              onChange={handleFiltroChange}
              placeholder="Buscar por motorista"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            Buscar
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={limpiarFiltros}
            disabled={loading}
          >
            Limpiar filtros
          </button>
        </div>
      </form>

      <div className="table-card mt-1">
        <div className="table-header">
          <div>
            <h2>Movimientos registrados</h2>
            <p className="table-subtitle">
              Total encontrado: <strong>{movimientos.length}</strong>
            </p>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => cargarMovimientos(filtros)}
            disabled={loading}
          >
            Refrescar
          </button>
        </div>

        {loading ? (
          <p>Cargando información...</p>
        ) : movimientos.length === 0 ? (
          <p>No hay movimientos registrados con los filtros seleccionados.</p>
        ) : (
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Vehículo</th>
                  <th>Motorista</th>
                  <th>Tipo</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Kilometraje</th>
                  <th>Observaciones</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {movimientos.map((movimiento) => (
                  <tr key={movimiento.id}>
                    <td>{movimiento.id}</td>
                    <td>
                      <strong>{movimiento.vehiculo}</strong>
                      <br />
                      <span className="muted-text">{movimiento.placa}</span>
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
                    <td>{Number(movimiento.kilometraje).toLocaleString()} km</td>
                    <td>{movimiento.observaciones || "Sin observaciones"}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-small btn-delete"
                        onClick={() => confirmarEliminar(movimiento)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default ConsultaMovimientosPage;