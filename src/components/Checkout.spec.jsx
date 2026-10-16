import {
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  render,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Checkout from "../components/Checkout";

describe("checkout", () => {
  it("registra un pedido con un servicio simulado", async () => {
    const usuario =
      userEvent.setup();

    const setCarrito =
      vi.fn();

    const servicioPedidos = {
      leerSesion: vi.fn(() => ({
        id: 1,
        nombre: "Camila",
        apellido: "Soto",
        correo:
          "camila@sonidovivo.cl",
        rol: "cliente",
      })),
      leerPedidos: vi.fn(
        () => [],
      ),
      guardarPedidos:
        vi.fn(),
    };

    const carrito = [
      {
        id: 2,
        nombre:
          "Micrófono Shure SM58",
        precio: 129900,
        cantidad: 1,
      },
    ];

    render(
      <MemoryRouter>
        <Checkout
          carrito={carrito}
          setCarrito={
            setCarrito
          }
          servicioPedidos={
            servicioPedidos
          }
        />
      </MemoryRouter>,
    );

    await usuario.selectOptions(
      screen.getByLabelText(
        "Tipo de entrega",
      ),
      "retiro",
    );

    await usuario.click(
      screen.getByRole(
        "button",
        {
          name:
            "Confirmar compra",
        },
      ),
    );

    expect(
      servicioPedidos
        .guardarPedidos,
    ).toHaveBeenCalledTimes(1);

    expect(
      servicioPedidos
        .guardarPedidos,
    ).toHaveBeenCalledWith([
      expect.objectContaining({
        usuarioId: 1,
        estado:
          "En preparación",
        tipoEntrega:
          "Retiro en tienda",
        total: 129900,
      }),
    ]);

    expect(
      setCarrito,
    ).toHaveBeenCalledWith([]);
  });
});
