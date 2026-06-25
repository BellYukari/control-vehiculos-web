import { useEffect, useState } from "react";
import ConfirmModal from "../components/ConfirmModal";
import { validarVehiculo } from "../utils/validaciones";
import {
  obtenerVehiculos,
  crearVehiculo,
  actualizarVehiculo,
  eliminarVehiculo,
} from "../api/vehiculosApi";

function VehiculosPage() {
  const estadoInicial = {
    marca: "",
    modelo: "",
    placa: "",
    estado: 1,
  };

  const [vehiculos, setVehiculos] = useState([]);
  const [formulario, setFormulario] = useState(estadoInicial);
  const [vehiculoEditando, setVehiculoEditando] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [vehiculoAEliminar, setVehiculoAEliminar] = useState(null);

  const cargarVehiculos = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await obtenerVehiculos();

      if (response.success) {
        setVehiculos(response.data);
      }
    } catch (error) {
      console.error("Error al cargar vehículos:", error);
      setError("No se pudieron cargar los vehículos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const abrirModalNuevo = () => {
    setFormulario(estadoInicial);
    setVehiculoEditando(null);
    setMensaje("");
    setError("");
    setModalVisible(true);
  };

  const abrirModalEditar = (vehiculo) => {
    setVehiculoEditando(vehiculo);

    setFormulario({
      marca: vehiculo.marca || "",
      modelo: vehiculo.modelo || "",
      placa: vehiculo.placa || "",
      estado: vehiculo.estado ?? 1,
    });

    setMensaje("");
    setError("");
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setFormulario(estadoInicial);
    setVehiculoEditando(null);
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
    const mensajeValidacion = validarVehiculo(formulario);

    if (mensajeValidacion) {
      setError(mensajeValidacion);
      return false;
    }

    return true;
  };

  const guardarVehiculo = async (event) => {
    event.preventDefault();

    setMensaje("");
    setError("");

    if (!validarFormulario()) {
      return;
    }

    try {
      setLoading(true);

      const datosVehiculo = {
        marca: formulario.marca.trim(),
        modelo: formulario.modelo.trim(),
        placa: formulario.placa.trim().toUpperCase(),
        estado: Number(formulario.estado),
      };

      let response;

      if (vehiculoEditando) {
        response = await actualizarVehiculo(vehiculoEditando.id, datosVehiculo);
      } else {
        response = await crearVehiculo(datosVehiculo);
      }

      if (response.success) {
        setMensaje(response.message);
        cerrarModal();
        await cargarVehiculos();
      }
    } catch (error) {
      console.error("Error al guardar vehículo:", error);
      setError(error.response?.data?.message || "Error al guardar el vehículo.");
    } finally {
      setLoading(false);
    }
  };

  const confirmarEliminar = (vehiculo) => {
    setVehiculoAEliminar(vehiculo);
    setConfirmVisible(true);
  };

  const eliminarVehiculoSeleccionado = async () => {
    if (!vehiculoAEliminar) return;

    try {
      setLoading(true);
      setMensaje("");
      setError("");

      const response = await eliminarVehiculo(vehiculoAEliminar.id);

      if (response.success) {
        setMensaje(response.message);
        await cargarVehiculos();
      }
    } catch (error) {
      console.error("Error al eliminar vehículo:", error);
      setError(error.response?.data?.message || "Error al eliminar el vehículo.");
    } finally {
      setLoading(false);
      setConfirmVisible(false);
      setVehiculoAEliminar(null);
    }
  };

  return (
    <section className="module-page">
      <div className="module-toolbar">
        <h1>Vehículos</h1>

        <div className="toolbar-actions">
          <button
            type="button"
            className="square-btn square-btn-refresh"
            onClick={cargarVehiculos}
            disabled={loading}
            title="Refrescar"
          >
            <i className="pi pi-refresh"></i>
          </button>

          <button
            type="button"
            className="square-btn square-btn-add"
            onClick={abrirModalNuevo}
            title="Agregar vehículo"
          >
            <i className="pi pi-plus"></i>
          </button>
        </div>
      </div>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && !modalVisible && <div className="alert alert-error">{error}</div>}

      <div className="system-table-card">
        {loading ? (
          <p>Cargando información...</p>
        ) : vehiculos.length === 0 ? (
          <p>No hay vehículos registrados.</p>
        ) : (
          <div className="responsive-table system-table-wrapper">
            <table className="system-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Placa</th>
                  <th>Estado</th>
                  <th>Fecha creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {vehiculos.map((vehiculo) => (
                  <tr key={vehiculo.id}>
                    <td>{vehiculo.id}</td>
                    <td>{vehiculo.marca}</td>
                    <td>{vehiculo.modelo}</td>
                    <td>
                      <strong>{vehiculo.placa}</strong>
                    </td>
                    <td>
                      <span
                        className={
                          Number(vehiculo.estado) === 1
                            ? "grid-status grid-status-active"
                            : "grid-status grid-status-inactive"
                        }
                      >
                        {vehiculo.estado_nombre}
                      </span>
                    </td>
                    <td>
                      {vehiculo.fecha_creacion
                        ? new Date(vehiculo.fecha_creacion).toLocaleDateString(
                            "es-HN"
                          )
                        : ""}
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          type="button"
                          className="icon-btn edit-icon"
                          onClick={() => abrirModalEditar(vehiculo)}
                          title="Editar"
                        >
                          <i className="pi pi-pencil"></i>
                        </button>

                        <button
                          type="button"
                          className="icon-btn delete-icon"
                          onClick={() => confirmarEliminar(vehiculo)}
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
          <div className="system-modal">
            <button type="button" className="modal-close" onClick={cerrarModal}>
              <i className="pi pi-times"></i>
            </button>

            <h2>{vehiculoEditando ? "Editar Vehículo" : "Agregar Vehículo"}</h2>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={guardarVehiculo}>
              <div className="modal-grid">
                <div className="form-group">
                  <label>Marca</label>
                  <input
                    type="text"
                    name="marca"
                    value={formulario.marca}
                    onChange={handleChange}
                    placeholder="Marca"
                    maxLength={50}
                  />
                </div>

                <div className="form-group">
                  <label>Modelo</label>
                  <input
                    type="text"
                    name="modelo"
                    value={formulario.modelo}
                    onChange={handleChange}
                    placeholder="Modelo"
                    maxLength={50}
                  />
                </div>

                <div className="form-group">
                  <label>Placa</label>
                  <input
                    type="text"
                    name="placa"
                    value={formulario.placa}
                    onChange={handleChange}
                    placeholder="Placa"
                    maxLength={10}
                  />
                </div>

                <div className="form-group">
                  <label>Estado</label>
                  <select
                    name="estado"
                    value={formulario.estado}
                    onChange={handleChange}
                  >
                    <option value={1}>Activo</option>
                    <option value={0}>Inactivo</option>
                  </select>
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

                <button type="submit" className="text-btn save-text-btn" disabled={loading}>
                  <i className="pi pi-check"></i>
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmModal
        visible={confirmVisible}
        title="Eliminar vehículo"
        message={
          vehiculoAEliminar
            ? `¿Está seguro de eliminar el vehículo con placa ${vehiculoAEliminar.placa}?`
            : "¿Está seguro de eliminar este vehículo?"
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
        onCancel={() => {
          setConfirmVisible(false);
          setVehiculoAEliminar(null);
        }}
        onConfirm={eliminarVehiculoSeleccionado}
      />
    </section>
  );
}

export default VehiculosPage;