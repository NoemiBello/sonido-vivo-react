// Estados del pedido que entrega Pedidos Service.
const NOMBRES = {
  PENDIENTE: "Pendiente",
  EN_PREPARACION: "En preparación",
  DESPACHADO: "Despachado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

const SIGUIENTE = {
  PENDIENTE: "EN_PREPARACION",
  EN_PREPARACION: "DESPACHADO",
  DESPACHADO: "ENTREGADO",
};

export function nombreEstado(estado) {
  return NOMBRES[estado] || estado;
}

export function siguienteEstado(estado) {
  return SIGUIENTE[estado];
}

export function puedeCancelar(estado) {
  return estado === "PENDIENTE" || estado === "EN_PREPARACION";
}

// "2026-11-24T22:10:00" -> "2026-11-24"
export function fechaPedido(pedido) {
  return pedido.fechaCreacion.slice(0, 10);
}
