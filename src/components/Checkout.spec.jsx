import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import Checkout from "./Checkout";
import CompraExitosa from "./CompraExitosa";
import { guardarPedidos, leerPedidos, leerSesion } from "../utils/storage";

vi.mock("../utils/storage", () => ({
  guardarPedidos: vi.fn(),
  leerPedidos: vi.fn(),
  leerSesion: vi.fn(),
}));

const carrito = [{ id: 1, nombre: "Guitarra", precio: 100000, cantidad: 2 }];

describe("confirmación de la compra", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    leerPedidos.mockReturnValue([]);
    leerSesion.mockReturnValue({ id: 3, rol: "USER" });
  });

  it("muestra los datos del comprador y el despacho elegido", async () => {
    const user = userEvent.setup();

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
    await user.selectOptions(
      screen.getByLabelText("Tipo de entrega"),
      "despacho",
    );
    await user.type(
      screen.getByLabelText("Dirección de entrega"),
      "Avenida Prueba 123",
    );
    await user.click(screen.getByRole("button", { name: "Confirmar compra" }));

    expect(
      await screen.findByText("¡Compra realizada con éxito!"),
    ).toBeInTheDocument();
    expect(screen.getByText("Camila Soto")).toBeInTheDocument();
    expect(screen.getByText("Despacho a domicilio")).toBeInTheDocument();
    expect(screen.getByText("Avenida Prueba 123")).toBeInTheDocument();

    expect(guardarPedidos).toHaveBeenCalledWith([
      expect.objectContaining({ usuarioId: 3, tipoEntrega: "Despacho" }),
    ]);
  });
});
