import { useEffect, useState } from "react";
import { obtenerVehiculos } from "../api/vehiculosApi";
import ConfirmModal from "../components/ConfirmModal";
import { validarMovimiento } from "../utils/validaciones";
import {
  obtenerMovimientos,
  crearMovimiento,
  actualizarMovimiento,
  eliminarMovimiento,
} from "../api/movimientosApi";

function MovimientosPage() {
  const getFechaActual = () => new Date().toISOString().split("T")[0];
  const getHoraActual = () => new Date().toTimeString().slice(0, 5);

  const estadoInicial = {
    vehiculo_id: "",
    motorista: "",
    tipo_movimiento: "Entrada",
    fecha: getFechaActual(),
    hora: getHoraActual(),
    kilometraje: "",
    observaciones: "",
  };

  const [vehiculos, setVehiculos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [formulario, setFormulario] = useState(estadoInicial);
  const [movimientoEditando, setMovimientoEditando] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [movimientoAEliminar, setMovimientoAEliminar] = useState(null);

  const cargarVehiculos = async () => {
    try {
      const response = await obtenerVehiculos();

      if (response.success) {
        const activos = response.data.filter(
          (vehiculo) => Number(vehiculo.estado) === 1
        );

        setVehiculos(activos);
      }
    } catch (error) {
      console.error("Error al cargar vehículos:", error);
      setError("No se pudieron cargar los vehículos.");
    }
  };

  const cargarMovimientos = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await obtenerMovimientos();

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
    cargarMovimientos();
  }, []);

  const abrirModalNuevo = () => {
    setFormulario({
      ...estadoInicial,
      fecha: getFechaActual(),
      hora: getHoraActual(),
    });

    setMovimientoEditando(null);
    setMensaje("");
    setError("");
    setModalVisible(true);
  };

  const abrirModalEditar = (movimiento) => {
    setMovimientoEditando(movimiento);

    setFormulario({
      vehiculo_id: movimiento.vehiculo_id || "",
      motorista: movimiento.motorista || "",
      tipo_movimiento: movimiento.tipo_movimiento || "Entrada",
      fecha: formatearFechaInput(movimiento.fecha),
      hora: formatearHora(movimiento.hora),
      kilometraje: movimiento.kilometraje || "",
      observaciones: movimiento.observaciones || "",
    });

    setMensaje("");
    setError("");
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setMovimientoEditando(null);
    setFormulario({
      ...estadoInicial,
      fecha: getFechaActual(),
      hora: getHoraActual(),
    });
    setError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const validarFormulario = () => {
    const mensajeValidacion = validarMovimiento(formulario);

    if (mensajeValidacion) {
      setError(mensajeValidacion);
      return false;
    }

    return true;
  };

  const guardarMovimiento = async (event) => {
    event.preventDefault();

    setMensaje("");
    setError("");

    if (!validarFormulario()) return;

    try {
      setLoading(true);

      const datosMovimiento = {
        vehiculo_id: Number(formulario.vehiculo_id),
        motorista: formulario.motorista.trim(),
        tipo_movimiento: formulario.tipo_movimiento,
        fecha: formulario.fecha,
        hora: formulario.hora,
        kilometraje: Number(formulario.kilometraje),
        observaciones: formulario.observaciones.trim(),
      };

      let response;

      if (movimientoEditando) {
        response = await actualizarMovimiento(
          movimientoEditando.id,
          datosMovimiento
        );
      } else {
        response = await crearMovimiento(datosMovimiento);
      }

      if (response.success) {
        setMensaje(response.message);
        cerrarModal();
        await cargarMovimientos();
      }
    } catch (error) {
      console.error("Error al guardar movimiento:", error);
      setError(
        error.response?.data?.message || "Error al guardar el movimiento."
      );
    } finally {
      setLoading(false);
    }
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
        await cargarMovimientos();
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

  const formatearFechaInput = (fecha) => {
    if (!fecha) return "";

    if (String(fecha).includes("T")) {
      return String(fecha).split("T")[0];
    }

    return String(fecha).slice(0, 10);
  };

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
        <h1>Entradas / Salidas</h1>

        <div className="toolbar-actions">
          <button
            type="button"
            className="square-btn square-btn-refresh"
            onClick={cargarMovimientos}
            disabled={loading}
            title="Refrescar"
          >
            <i className="pi pi-refresh"></i>
          </button>

          <button
            type="button"
            className="square-btn square-btn-add"
            onClick={abrirModalNuevo}
            title="Agregar movimiento"
          >
            <i className="pi pi-plus"></i>
          </button>
        </div>
      </div>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && !modalVisible && <div className="alert alert-error">{error}</div>}

      <div className="system-table-card">
        {loading ? (
          <p className="table-empty-message">Cargando información...</p>
        ) : movimientos.length === 0 ? (
          <p className="table-empty-message">No hay movimientos registrados.</p>
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
                    <td>{movimiento.vehiculo}</td>
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
                          className="icon-btn edit-icon"
                          onClick={() => abrirModalEditar(movimiento)}
                          title="Editar"
                        >
                          <i className="pi pi-pencil"></i>
                        </button>

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

      {modalVisible && (
        <div className="modal-backdrop">
          <div className="system-modal large-modal">
            <button type="button" className="modal-close" onClick={cerrarModal}>
              <i className="pi pi-times"></i>
            </button>

            <h2>
              {movimientoEditando
                ? "Editar Movimiento"
                : "Agregar Movimiento"}
            </h2>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={guardarMovimiento}>
              <div className="modal-grid">
                <div className="form-group">
                  <label>Vehículo</label>
                  <select
                    name="vehiculo_id"
                    value={formulario.vehiculo_id}
                    onChange={handleChange}
                  >
                    <option value="">Seleccione un vehículo</option>

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
                    value={formulario.motorista}
                    onChange={handleChange}
                    placeholder="Motorista"
                    maxLength={100}
                  />
                </div>

                <div className="form-group">
                  <label>Tipo de movimiento</label>
                  <select
                    name="tipo_movimiento"
                    value={formulario.tipo_movimiento}
                    onChange={handleChange}
                  >
                    <option value="Entrada">Entrada</option>
                    <option value="Salida">Salida</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Kilometraje</label>
                  <input
                    type="number"
                    name="kilometraje"
                    value={formulario.kilometraje}
                    onChange={handleChange}
                    placeholder="Kilometraje"
                    min="0"
                    max="9999999"
                  />
                </div>

                <div className="form-group">
                  <label>Fecha</label>
                  <input
                    type="date"
                    name="fecha"
                    value={formulario.fecha}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Hora</label>
                  <input
                    type="time"
                    name="hora"
                    value={formulario.hora}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group full-field">
                  <label>Observaciones</label>
                  <textarea
                    name="observaciones"
                    value={formulario.observaciones}
                    onChange={handleChange}
                    placeholder="Observaciones"
                    rows="3"
                    maxLength={255}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="text-btn"
                  onClick={cerrarModal}
                  disabled={loading}
                >
                  <i className="pi pi-times"></i>
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="text-btn save-text-btn"
                  disabled={loading}
                >
                  <i className="pi pi-check"></i>
                  {movimientoEditando ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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

export default MovimientosPage;