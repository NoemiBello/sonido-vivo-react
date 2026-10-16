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
import Registro from "../pages/Registro";

describe("registro de usuarios", () => {
  it("envía el usuario al servicio simulado", async () => {
    const usuario =
      userEvent.setup();

    const servicioUsuarios = {
      leerUsuarios: vi.fn(
        () => [],
      ),
      guardarUsuarios: vi.fn(),
    };

    render(
      <MemoryRouter>
        <Registro
          servicioUsuarios={
            servicioUsuarios
          }
        />
      </MemoryRouter>,
    );

    await usuario.type(
      screen.getByLabelText(
        "Nombre",
      ),
      "Manuel",
    );

    await usuario.type(
      screen.getByLabelText(
        "Apellido",
      ),
      "Rodríguez",
    );

    await usuario.type(
      screen.getByLabelText(
        "Correo",
      ),
      "manuel@correo.cl",
    );

    await usuario.type(
      screen.getByLabelText(
        "Contraseña",
      ),
      "123456",
    );

    await usuario.type(
      screen.getByLabelText(
        "Confirmar contraseña",
      ),
      "123456",
    );

    await usuario.click(
      screen.getByRole(
        "button",
        { name: "Crear cuenta" },
      ),
    );

    expect(
      servicioUsuarios
        .guardarUsuarios,
    ).toHaveBeenCalledTimes(1);

    expect(
      servicioUsuarios
        .guardarUsuarios,
    ).toHaveBeenCalledWith([
      expect.objectContaining({
        nombre: "Manuel",
        apellido: "Rodríguez",
        correo:
          "manuel@correo.cl",
        rol: "cliente",
        activo: true,
      }),
    ]);
  });
});
