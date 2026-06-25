export const soloTextoSeguro = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.-]+$/;

export const soloNombrePersona = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s.]+$/;

export const placaValida = /^[A-Za-z0-9-]+$/;

export const validarVehiculo = (formulario) => {
  const marca = formulario.marca?.trim() || "";
  const modelo = formulario.modelo?.trim() || "";
  const placa = formulario.placa?.trim() || "";

  if (!marca) {
    return "La marca es obligatoria.";
  }

  if (marca.length < 2) {
    return "La marca debe tener al menos 2 caracteres.";
  }

  if (marca.length > 50) {
    return "La marca no puede tener más de 50 caracteres.";
  }

  if (!soloTextoSeguro.test(marca)) {
    return "La marca solo puede contener letras, números, espacios, puntos o guiones.";
  }

  if (!modelo) {
    return "El modelo es obligatorio.";
  }

  if (modelo.length < 2) {
    return "El modelo debe tener al menos 2 caracteres.";
  }

  if (modelo.length > 50) {
    return "El modelo no puede tener más de 50 caracteres.";
  }

  if (!soloTextoSeguro.test(modelo)) {
    return "El modelo solo puede contener letras, números, espacios, puntos o guiones.";
  }

  if (!placa) {
    return "La placa es obligatoria.";
  }

  if (placa.includes(" ")) {
    return "La placa no debe contener espacios.";
  }

  if (placa.length < 5) {
    return "La placa debe tener al menos 5 caracteres.";
  }

  if (placa.length > 10) {
    return "La placa no puede tener más de 10 caracteres.";
  }

  if (!placaValida.test(placa)) {
    return "La placa solo puede contener letras, números y guiones.";
  }

  return "";
};

export const validarMovimiento = (formulario) => {
  const motorista = formulario.motorista?.trim() || "";
  const observaciones = formulario.observaciones?.trim() || "";
  const hoy = new Date().toISOString().split("T")[0];
  //const horaActual = new Date().toTimeString().slice(0, 5);
  const fechaActual = new Date().toISOString().split("T")[0];

  if (!formulario.vehiculo_id) {
    return "Debe seleccionar un vehículo.";
  }

  if (!motorista) {
    return "El motorista es obligatorio.";
  }

  if (motorista.length < 3) {
    return "El motorista debe tener al menos 3 caracteres.";
  }

  if (motorista.length > 100) {
    return "El motorista no puede tener más de 100 caracteres.";
  }

  if (!soloNombrePersona.test(motorista)) {
    return "El motorista solo puede contener letras, espacios, tildes, ñ y puntos.";
  }

  if (!formulario.tipo_movimiento) {
    return "Debe seleccionar el tipo de movimiento.";
  }

  if (!["Entrada", "Salida"].includes(formulario.tipo_movimiento)) {
    return "El tipo de movimiento debe ser Entrada o Salida.";
  }

  if (!formulario.fecha) {
    return "La fecha es obligatoria.";
  }

  if (formulario.fecha < hoy) {
  return "La fecha no puede ser pasada.";
}

if (!formulario.hora) {
  return "La hora es obligatoria.";
}


  if (
    formulario.kilometraje === "" ||
    formulario.kilometraje === null ||
    formulario.kilometraje === undefined
  ) {
    return "El kilometraje es obligatorio.";
  }

  if (Number.isNaN(Number(formulario.kilometraje))) {
    return "El kilometraje debe ser un número válido.";
  }

  if (Number(formulario.kilometraje) < 0) {
    return "El kilometraje no puede ser negativo.";
  }

  if (Number(formulario.kilometraje) > 9999999) {
    return "El kilometraje no puede ser mayor a 9,999,999.";
  }

  if (observaciones.length > 255) {
    return "Las observaciones no pueden tener más de 255 caracteres.";
  }

  return "";
};