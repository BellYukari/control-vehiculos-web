import { useEffect, useState } from "react";
import { obtenerVehiculos } from "../api/vehiculosApi";
import { crearMovimiento } from "../api/movimientosApi";

function MovimientosPage() {
  const estadoInicial = {
    vehiculo_id: "",
    motorista: "",
    tipo_movimiento: "Entrada",
    fecha: "",
    hora: "",
    kilometraje: "",
    observaciones: "",
  };

  const [vehiculos, setVehiculos] = useState([]);
  const [formulario, setFormulario] = useState(estadoInicial);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const cargarVehiculos = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await obtenerVehiculos();

      if (response.success) {
        const vehiculosActivos = response.data.filter(
          (vehiculo) => Number(vehiculo.estado) === 1
        );

        setVehiculos(vehiculosActivos);
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

    const hoy = new Date();
    const fechaActual = hoy.toISOString().split("T")[0];
    const horaActual = hoy.toTimeString().slice(0, 5);

    setFormulario((prevState) => ({
      ...prevState,
      fecha: fechaActual,
      hora: horaActual,
    }));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const validarFormulario = () => {
    if (!formulario.vehiculo_id) {
      setError("Debe seleccionar un vehículo.");
      return false;
    }

    if (!formulario.motorista.trim()) {
      setError("El nombre del motorista es obligatorio.");
      return false;
    }

    if (!formulario.tipo_movimiento) {
      setError("Debe seleccionar el tipo de movimiento.");
      return false;
    }

    if (!formulario.fecha) {
      setError("La fecha es obligatoria.");
      return false;
    }

    if (!formulario.hora) {
      setError("La hora es obligatoria.");
      return false;
    }

    if (
      formulario.kilometraje === "" ||
      formulario.kilometraje === null ||
      formulario.kilometraje === undefined
    ) {
      setError("El kilometraje es obligatorio.");
      return false;
    }

    if (Number(formulario.kilometraje) < 0) {
      setError("El kilometraje no puede ser negativo.");
      return false;
    }

    return true;
  };

  const limpiarFormulario = () => {
    const hoy = new Date();
    const fechaActual = hoy.toISOString().split("T")[0];
    const horaActual = hoy.toTimeString().slice(0, 5);

    setFormulario({
      ...estadoInicial,
      fecha: fechaActual,
      hora: horaActual,
    });

    setError("");
  };

  const guardarMovimiento = async (event) => {
    event.preventDefault();

    setMensaje("");
    setError("");

    if (!validarFormulario()) {
      return;
    }

    try {
      setLoading(true);

      const datosMovimiento = {
        vehiculo_id: Number(formulario.vehiculo_id),
        motorista: formulario.motorista,
        tipo_movimiento: formulario.tipo_movimiento,
        fecha: formulario.fecha,
        hora: formulario.hora,
        kilometraje: Number(formulario.kilometraje),
        observaciones: formulario.observaciones,
      };

      const response = await crearMovimiento(datosMovimiento);

      if (response.success) {
        setMensaje(response.message);
        limpiarFormulario();
      }
    } catch (error) {
      console.error("Error al registrar movimiento:", error);
      setError(
        error.response?.data?.message || "Error al registrar el movimiento."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-card">
      <div className="page-header">
        <div>
          <h1>Registro de Entradas y Salidas</h1>
          <p>Registre los movimientos realizados por cada vehículo.</p>
        </div>
      </div>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="movement-layout">
        <form className="form-card movement-form" onSubmit={guardarMovimiento}>
          <h2>Nuevo movimiento</h2>

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
              placeholder="Ejemplo: Juan Pérez"
            />
          </div>

          <div className="form-row">
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
                placeholder="Ejemplo: 25000"
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
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
          </div>

          <div className="form-group">
            <label>Observaciones</label>
            <textarea
              name="observaciones"
              value={formulario.observaciones}
              onChange={handleChange}
              placeholder="Observaciones adicionales"
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              Registrar movimiento
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={limpiarFormulario}
              disabled={loading}
            >
              Limpiar
            </button>
          </div>
        </form>

        <div className="info-panel">
          <div className="info-card">
            <i className="pi pi-car"></i>
            <h3>Vehículos disponibles</h3>
            <p>
              Solo se muestran vehículos activos para registrar entradas y
              salidas.
            </p>
            <strong>{vehiculos.length}</strong>
          </div>

          <div className="info-card">
            <i className="pi pi-info-circle"></i>
            <h3>Recomendación</h3>
            <p>
              Verifique el kilometraje antes de registrar una entrada o salida
              para mantener el historial correcto.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MovimientosPage;