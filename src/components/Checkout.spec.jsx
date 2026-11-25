import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import Checkout from "./Checkout";
import CompraExitosa from "./CompraExitosa";
import { crearPedido } from "../services/pedidosService";
import { leerSesion } from "../utils/storage";

// El backend simulado rechaza las compras de más de 5 unidades.
vi.mock("../services/pedidosService", () => ({
  crearPedido: vi.fn(async ({ detalles }) => {
    if (detalles[0].cantidad > 5) {
      throw new Error("No hay stock suficiente para el producto 1");
    }

    return { id: 10, total: 200000, estado: "PENDIENTE" };
  }),
}));

vi.mock("../services/usuariosService", () => ({
  buscarUsuarioPorCorreo: vi.fn(async () => ({ id: 3 })),
}));

vi.mock("../utils/storage", () => ({ leerSesion: vi.fn() }));

async function comprar(cantidad, entrega) {
  const user = userEvent.setup();
  const carrito = [{ id: 1, nombre: "Guitarra", precio: 100000, cantidad }];

  render(
    <MemoryRouter initialEntries={["/checkout"]}>
      <Routes>
        <Route
          path="/checkout"
          element={<Checkout carrito={carrito} setCarrito={vi.fn()} />}
        />
        <Route path="/compra-exitosa" element={<CompraExitosa />} />
      </Routes>
    </MemoryRouter>,
  );

  await user.type(screen.getByLabelText("Nombre completo"), "Camila Soto");
  await user.type(
    screen.getByLabelText("Correo electrónico"),
    "camila@sonidovivo.cl",
  );
  await user.selectOptions(screen.getByLabelText("Tipo de entrega"), entrega);

  if (entrega === "despacho") {
    await user.type(
      screen.getByLabelText("Dirección de entrega"),
      "Avenida Prueba 123",
    );
  }

  await user.click(screen.getByRole("button", { name: "Confirmar compra" }));
}

describe("confirmación de la compra", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    leerSesion.mockReturnValue({ correo: "camila@sonidovivo.cl", rol: "USER" });
  });

  it("envía el pedido a la API y muestra el despacho", async () => {
    await comprar(2, "despacho");

    expect(
      await screen.findByText("¡Compra realizada con éxito!"),
    ).toBeInTheDocument();
    expect(screen.getByText("Camila Soto")).toBeInTheDocument();
    expect(screen.getByText("Avenida Prueba 123")).toBeInTheDocument();

    expect(crearPedido).toHaveBeenCalledWith({
      usuarioId: 3,
      nombreCliente: "Camila Soto",
      direccionEntrega: "Avenida Prueba 123",
      detalles: [{ productoId: 1, cantidad: 2 }],
    });
  });

  it("permite retirar en tienda sin dirección", async () => {
    await comprar(1, "retiro");

    expect(
      await screen.findByText("¡Compra realizada con éxito!"),
    ).toBeInTheDocument();
    expect(crearPedido).toHaveBeenCalledWith(
      expect.objectContaining({ direccionEntrega: "Retiro en tienda" }),
    );
  });

  it("muestra el error si no hay stock", async () => {
    await comprar(6, "retiro");

    expect(
      await screen.findByText("No hay stock suficiente para el producto 1"),
    ).toBeInTheDocument();
  });
});
