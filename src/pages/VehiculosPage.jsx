import { useEffect, useState } from "react";
import { obtenerVehiculos, crearVehiculo, actualizarVehiculo, eliminarVehiculo } from "../api/vehiculosApi";

function VehiculosPage () {
  const estadoInicial = {
    marca: "",
    modelo: "",
    placa: "",
    estado: 1,
  };

  const [vehiculos, setVehiculos] = useState([]);
  const [formulario, setFormulario] = useState(estadoInicial);
  const [vehiculoEditando, setVehiculoEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

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

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const validarFormulario = () => {
    if (!formulario.marca.trim()) {
      setError("La marca es obligatoria.");
      return false;
    }

    if (!formulario.modelo.trim()) {
      setError("El modelo es obligatorio.");
      return false;
    }

    if (!formulario.placa.trim()) {
      setError("La placa es obligatoria.");
      return false;
    }

    if (formulario.placa.trim().length < 5) {
      setError("La placa debe tener al menos 5 caracteres.");
      return false;
    }

    return true;
  };

  const limpiarFormulario = () => {
    setFormulario(estadoInicial);
    setVehiculoEditando(null);
    setError("");
    setMensaje("");
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
        marca: formulario.marca,
        modelo: formulario.modelo,
        placa: formulario.placa,
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
        limpiarFormulario();
        await cargarVehiculos();
      }
    } catch (error) {
      console.error("Error al guardar vehículo:", error);
      setError(error.response?.data?.message || "Error al guardar el vehículo.");
    } finally {
      setLoading(false);
    }
  };

  const seleccionarVehiculo = (vehiculo) => {
    setVehiculoEditando(vehiculo);

    setFormulario({
      marca: vehiculo.marca || "",
      modelo: vehiculo.modelo || "",
      placa: vehiculo.placa || "",
      estado: vehiculo.estado ?? 1,
    });

    setMensaje("");
    setError("");
  };

  const confirmarEliminar = async (vehiculo) => {
    const confirmar = window.confirm(
      `¿Está seguro de eliminar el vehículo con placa ${vehiculo.placa}?`
    );

    if (!confirmar) {
      return;
    }

    try {
      setLoading(true);
      setMensaje("");
      setError("");

      const response = await eliminarVehiculo(vehiculo.id);

      if (response.success) {
        setMensaje(response.message);
        await cargarVehiculos();

        if (vehiculoEditando?.id === vehiculo.id) {
          limpiarFormulario();
        }
      }
    } catch (error) {
      console.error("Error al eliminar vehículo:", error);
      setError(error.response?.data?.message || "Error al eliminar el vehículo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-card">
      <div className="page-header">
        <div>
          <h1>Registro de Vehículos</h1>
          <p>Administre los vehículos registrados en el sistema.</p>
        </div>
      </div>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="content-grid">
        <form className="form-card" onSubmit={guardarVehiculo}>
          <h2>{vehiculoEditando ? "Editar vehículo" : "Nuevo vehículo"}</h2>

          <div className="form-group">
            <label>Marca</label>
            <input
              type="text"
              name="marca"
              value={formulario.marca}
              onChange={handleChange}
              placeholder="Ejemplo: Toyota"
            />
          </div>

          <div className="form-group">
            <label>Modelo</label>
            <input
              type="text"
              name="modelo"
              value={formulario.modelo}
              onChange={handleChange}
              placeholder="Ejemplo: Hilux"
            />
          </div>

          <div className="form-group">
            <label>Placa</label>
            <input
              type="text"
              name="placa"
              value={formulario.placa}
              onChange={handleChange}
              placeholder="Ejemplo: HAA1234"
            />
          </div>

          {vehiculoEditando && (
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
          )}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {vehiculoEditando ? "Actualizar" : "Guardar"}
            </button>

            {vehiculoEditando && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={limpiarFormulario}
                disabled={loading}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="table-card">
          <div className="table-header">
            <h2>Listado de vehículos</h2>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={cargarVehiculos}
              disabled={loading}
            >
              Refrescar
            </button>
          </div>

          {loading ? (
            <p>Cargando información...</p>
          ) : vehiculos.length === 0 ? (
            <p>No hay vehículos registrados.</p>
          ) : (
            <div className="responsive-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Placa</th>
                    <th>Estado</th>
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
                            vehiculo.estado === 1
                              ? "status status-active"
                              : "status status-inactive"
                          }
                        >
                          {vehiculo.estado_nombre}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="btn btn-small btn-edit"
                            onClick={() => seleccionarVehiculo(vehiculo)}
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            className="btn btn-small btn-delete"
                            onClick={() => confirmarEliminar(vehiculo)}
                          >
                            Eliminar
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
      </div>
    </section>
  );
}

export default VehiculosPage;