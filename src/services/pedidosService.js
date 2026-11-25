import { request } from "./request";

const API_URL =
  import.meta.env.VITE_PEDIDOS_API_URL || "http://localhost:8087/api/pedidos";

// Cliente: confirma su compra y consulta su historial
export const crearPedido = (datos) =>
  request(API_URL, {
    method: "POST",
    body: JSON.stringify(datos),
  });

export const listarPedidosDeUsuario = (usuarioId) =>
  request(`${API_URL}/usuario/${usuarioId}`);

// Vendedor y administrador: lista y detalle
export const listarPedidos = () => request(API_URL);

export const buscarPedido = (id) => request(`${API_URL}/${id}`);

// Administrador: avanza o cancela el pedido
export const cambiarEstadoPedido = (id, estado) =>
  request(`${API_URL}/${id}/estado?estado=${estado}`, {
    method: "PATCH",
  });
