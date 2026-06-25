import { useEffect, useState } from "react";
import { obtenerVehiculos } from "../api/vehiculosApi";
import ConfirmModal from "../components/ConfirmModal";
import { obtenerMovimientos, eliminarMovimiento } from "../api/movimientosApi";

function ConsultaMovimientosPage() {
  const filtrosIniciales = {
    fecha_inicio: "",
    fecha_fin: "",
    vehiculo_id: "",
    motorista: "",
    tipo_movimiento: "",
  };

  const [vehiculos, setVehiculos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [filtros, setFiltros] = useState(filtrosIniciales);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [movimientoAEliminar, setMovimientoAEliminar] = useState(null);

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

  const limpiarObjetoFiltros = (filtrosAplicados) => {
    const filtrosLimpios = {};

    if (filtrosAplicados.fecha_inicio) {
      filtrosLimpios.fecha_inicio = filtrosAplicados.fecha_inicio;
    }

    if (filtrosAplicados.fecha_fin) {
      filtrosLimpios.fecha_fin = filtrosAplicados.fecha_fin;
    }

    if (filtrosAplicados.vehiculo_id) {
      filtrosLimpios.vehiculo_id = filtrosAplicados.vehiculo_id;
    }

    if (filtrosAplicados.motorista.trim()) {
      filtrosLimpios.motorista = filtrosAplicados.motorista.trim();
    }

    if (filtrosAplicados.tipo_movimiento) {
      filtrosLimpios.tipo_movimiento = filtrosAplicados.tipo_movimiento;
    }

    return filtrosLimpios;
  };

  const validarFiltros = () => {
    if (
      filtros.fecha_inicio &&
      filtros.fecha_fin &&
      filtros.fecha_inicio > filtros.fecha_fin
    ) {
      setError("La fecha inicio no puede ser mayor que la fecha fin.");
      return false;
    }

    return true;
  };

  const cargarMovimientos = async (filtrosAplicados = filtros) => {
    try {
      setLoading(true);
      setError("");

      const filtrosLimpios = limpiarObjetoFiltros(filtrosAplicados);
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
    setError("");

    if (!validarFiltros()) {
      return;
    }

    cargarMovimientos(filtros);
  };

  const limpiarFiltros = () => {
    setFiltros(filtrosIniciales);
    setMensaje("");
    setError("");
    cargarMovimientos(filtrosIniciales);
  };

  const refrescarMovimientos = () => {
    setMensaje("");
    setError("");

    if (!validarFiltros()) {
      return;
    }

    cargarMovimientos(filtros);
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

  const confirmarEliminar = (movimiento) => {
    setMovimientoAEliminar(movimiento);
    setConfirmVisible(true);
  };

  const eliminarMovimientoSeleccionado = async () => {
    if (!movimientoAEliminar) return;

    try {
      setLoading(true);
      setMensaje("");
      setError("");

      const response = await eliminarMovimiento(movimientoAEliminar.id);

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
      setConfirmVisible(false);
      setMovimientoAEliminar(null);
    }
  };

  const limpiarValorCSV = (valor) => {
  if (valor === null || valor === undefined) return "";

  const texto = String(valor).replace(/"/g, '""');

  return `"${texto}"`;
  };

  const exportarCSV = () => {
    if (movimientos.length === 0) {
      setError("No hay movimientos para exportar.");
      return;
    }

    const encabezados = [
      "ID",
      "Vehiculo",
      "Placa",
      "Motorista",
      "Tipo",
      "Fecha",
      "Hora",
      "Kilometraje",
      "Observaciones",
    ];

    const filas = movimientos.map((movimiento) => [
      movimiento.id,
      movimiento.vehiculo,
      movimiento.placa,
      movimiento.motorista,
      movimiento.tipo_movimiento,
      formatearFecha(movimiento.fecha),
      formatearHora(movimiento.hora),
      movimiento.kilometraje,
      movimiento.observaciones || "Sin observaciones",
    ]);

    const contenidoCSV = [
      encabezados.map(limpiarValorCSV).join(","),
      ...filas.map((fila) => fila.map(limpiarValorCSV).join(",")),
    ].join("\n");

    const blob = new Blob([`\uFEFF${contenidoCSV}`], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const fechaActual = new Date().toISOString().split("T")[0];

    link.href = url;
    link.download = `movimientos_${fechaActual}.csv`;
    link.click();

    URL.revokeObjectURL(url);

    setMensaje("Archivo CSV generado correctamente.");
    setError("");
  };

  return (
    <section className="module-page">
      <div className="module-toolbar">
        <h1>Consulta de Movimientos</h1>

        <div className="toolbar-actions">
          <button
            type="button"
            className="square-btn square-btn-export"
            onClick={exportarCSV}
            disabled={loading || movimientos.length === 0}
            title="Exportar CSV"
          >
            <i className="pi pi-file-export"></i>
          </button>

          <button
            type="button"
            className="square-btn square-btn-refresh"
            onClick={refrescarMovimientos}
            disabled={loading}
            title="Refrescar"
          >
            <i className="pi pi-refresh"></i>
          </button>
        </div>
      </div>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <form className="filter-card" onSubmit={buscarMovimientos}>
        <div className="filter-grid filter-grid-advanced">
          <div className="form-group">
            <label>Fecha inicio</label>
            <input
              type="date"
              name="fecha_inicio"
              value={filtros.fecha_inicio}
              onChange={handleFiltroChange}
            />
          </div>

          <div className="form-group">
            <label>Fecha fin</label>
            <input
              type="date"
              name="fecha_fin"
              value={filtros.fecha_fin}
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

          <div className="form-group">
            <label>Tipo de movimiento</label>
            <select
              name="tipo_movimiento"
              value={filtros.tipo_movimiento}
              onChange={handleFiltroChange}
            >
              <option value="">Todos</option>
              <option value="Entrada">Entrada</option>
              <option value="Salida">Salida</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <i className="pi pi-search"></i> Buscar
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={limpiarFiltros}
            disabled={loading}
          >
            <i className="pi pi-times"></i> Limpiar filtros
          </button>
        </div>
      </form>

      <div className="system-table-card">
        <div className="table-header consultation-header">
          <div>
            <h2>Movimientos registrados</h2>
            <p className="table-subtitle">
              Total encontrado: <strong>{movimientos.length}</strong>
            </p>
          </div>
        </div>

        {loading ? (
          <p className="table-empty-message">Cargando información...</p>
        ) : movimientos.length === 0 ? (
          <p className="table-empty-message">
            No hay movimientos registrados con los filtros seleccionados.
          </p>
        ) : (
          <div className="responsive-table system-table-wrapper">
            <table className="system-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Vehículo</th>
                  <th>Placa</th>
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
                      <span className="muted-text">
                        {movimiento.marca} {movimiento.modelo}
                      </span>
                    </td>

                    <td>
                      <strong>{movimiento.placa}</strong>
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
                      <div className="row-actions">
                        <button
                          type="button"
                          className="icon-btn delete-icon"
                          onClick={() => confirmarEliminar(movimiento)}
                          title="Eliminar"
                        >
                          <i className="pi pi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ConfirmModal
        visible={confirmVisible}
        title="Eliminar movimiento"
        message={
          movimientoAEliminar
            ? `¿Está seguro de eliminar este movimiento de ${movimientoAEliminar.tipo_movimiento} para el vehículo ${movimientoAEliminar.placa}?`
            : "¿Está seguro de eliminar este movimiento?"
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
        onCancel={() => {
          setConfirmVisible(false);
          setMovimientoAEliminar(null);
        }}
        onConfirm={eliminarMovimientoSeleccionado}
      />
    </section>
  );
}

export default ConsultaMovimientosPage;