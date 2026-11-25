import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { TiendaContext } from "../context/TiendaContext";
import OrdenesVendedor from "./OrdenesVendedor";
import { buscarPedido, listarPedidos } from "../services/pedidosService";
import { leerSesion } from "../utils/storage";

vi.mock("../services/pedidosService", () => ({
  buscarPedido: vi.fn(),
  listarPedidos: vi.fn(),
}));

vi.mock("../utils/storage", () => ({ leerSesion: vi.fn() }));

const orden = {
  id: 7,
  nombreCliente: "Camila Soto",
  direccionEntrega: "Retiro en tienda",
  fechaCreacion: "2026-11-24T22:10:00",
  total: 100000,
  estado: "PENDIENTE",
  detalles: [{ id: 1, productoId: 1, cantidad: 1, subtotal: 100000 }],
};

describe("órdenes del vendedor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    leerSesion.mockReturnValue({ rol: "VENDEDOR" });
    listarPedidos.mockResolvedValue([orden]);
    buscarPedido.mockResolvedValue(orden);
  });

  it("muestra la lista y el detalle sin acciones de edición", async () => {
    const user = userEvent.setup();

    render(
      <TiendaContext.Provider value={{ productos: [{ id: 1, nombre: "Guitarra" }] }}>
        <MemoryRouter>
          <OrdenesVendedor />
        </MemoryRouter>
      </TiendaContext.Provider>,
    );

    await user.click(await screen.findByText("Ver orden"));

    expect(await screen.findByText("Detalle de la orden #7")).toBeInTheDocument();
    expect(buscarPedido).toHaveBeenCalledWith(7);
    expect(screen.queryByText("Cancelar")).not.toBeInTheDocument();
  });
});
