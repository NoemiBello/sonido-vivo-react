import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import AdminPedidos from "./AdminPedidos";
import { cambiarEstadoPedido, listarPedidos } from "../../services/pedidosService";
import { leerSesion } from "../../utils/storage";

vi.mock("../../services/pedidosService", () => ({
  cambiarEstadoPedido: vi.fn(),
  listarPedidos: vi.fn(),
}));

vi.mock("../../utils/storage", () => ({ leerSesion: vi.fn() }));

const pedido = {
  id: 1,
  nombreCliente: "Camila Soto",
  direccionEntrega: "Retiro en tienda",
  fechaCreacion: "2026-11-24T22:10:00",
  total: 100000,
  estado: "PENDIENTE",
  detalles: [],
};

function renderPedidos() {
  return render(
    <MemoryRouter>
      <AdminPedidos />
    </MemoryRouter>,
  );
}

describe("administración de pedidos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    leerSesion.mockReturnValue({ rol: "ADMIN" });
    listarPedidos.mockResolvedValue([pedido]);
  });

  it("avanza el pedido al siguiente estado", async () => {
    const user = userEvent.setup();
    cambiarEstadoPedido.mockResolvedValue({ ...pedido, estado: "EN_PREPARACION" });

    renderPedidos();
    await user.click(await screen.findByText("Pasar a En preparación"));

    expect(cambiarEstadoPedido).toHaveBeenCalledWith(1, "EN_PREPARACION");
    expect(await screen.findByText("Pasar a Despachado")).toBeInTheDocument();
  });

  it("no permite cambiar un pedido entregado", async () => {
    listarPedidos.mockResolvedValue([{ ...pedido, estado: "ENTREGADO" }]);

    renderPedidos();

    expect(await screen.findByText("Entregado")).toBeInTheDocument();
    expect(screen.queryByText("Cancelar")).not.toBeInTheDocument();
  });
});
