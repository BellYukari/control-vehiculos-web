import api from "./axiosConfig";

export const obtenerMovimientos = async (filtros = {}) => {
  const response = await api.get("/movimientos", {
    params: filtros,
  });

  return response.data;
};

export const crearMovimiento = async (movimiento) => {
  const response = await api.post("/movimientos", movimiento);
  return response.data;
};

export const actualizarMovimiento = async (id, movimiento) => {
  const response = await api.put(`/movimientos/${id}`, movimiento);
  return response.data;
};

export const eliminarMovimiento = async (id) => {
  const response = await api.delete(`/movimientos/${id}`);
  return response.data;
};