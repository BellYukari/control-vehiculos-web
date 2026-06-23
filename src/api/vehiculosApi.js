import api from "./axiosConfig";

export const obtenerVehiculos = async () => {
  const response = await api.get("/vehiculos");
  return response.data;
};

export const crearVehiculo = async (vehiculo) => {
  const response = await api.post("/vehiculos", vehiculo);
  return response.data;
};

export const actualizarVehiculo = async (id, vehiculo) => {
  const response = await api.put(`/vehiculos/${id}`, vehiculo);
  return response.data;
};

export const eliminarVehiculo = async (id) => {
  const response = await api.delete(`/vehiculos/${id}`);
  return response.data;
};