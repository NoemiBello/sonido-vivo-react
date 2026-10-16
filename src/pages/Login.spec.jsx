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
import Login from "../pages/Login";

describe("inicio de sesión", () => {
  it("rechaza credenciales incorrectas", async () => {
    const usuario =
      userEvent.setup();

    const servicioUsuarios = {
      leerUsuarios: vi.fn(
        () => [],
      ),
      guardarSesion: vi.fn(),
    };

    render(
      <MemoryRouter>
        <Login
          servicioUsuarios={
            servicioUsuarios
          }
        />
      </MemoryRouter>,
    );

    await usuario.type(
      screen.getByLabelText(
        "Correo",
      ),
      "incorrecto@correo.cl",
    );

    await usuario.type(
      screen.getByLabelText(
        "Contraseña",
      ),
      "000000",
    );

    await usuario.click(
      screen.getByRole(
        "button",
        { name: "Ingresar" },
      ),
    );

    expect(
      screen.getByText(
        "Correo o contraseña incorrectos.",
      ),
    ).toBeInTheDocument();

    expect(
      servicioUsuarios
        .guardarSesion,
    ).not.toHaveBeenCalled();
  });

  it("usa el mock de sesión con credenciales válidas", async () => {
    const usuario =
      userEvent.setup();

    const cliente = {
      id: 1,
      nombre: "Camila",
      apellido: "Soto",
      correo:
        "camila@sonidovivo.cl",
      password: "123456",
      rol: "cliente",
      activo: true,
    };

    const servicioUsuarios = {
      leerUsuarios: vi.fn(
        () => [cliente],
      ),
      guardarSesion: vi.fn(),
    };

    render(
      <MemoryRouter>
        <Login
          servicioUsuarios={
            servicioUsuarios
          }
        />
      </MemoryRouter>,
    );

    await usuario.type(
      screen.getByLabelText(
        "Correo",
      ),
      "camila@sonidovivo.cl",
    );

    await usuario.type(
      screen.getByLabelText(
        "Contraseña",
      ),
      "123456",
    );

    await usuario.click(
      screen.getByRole(
        "button",
        { name: "Ingresar" },
      ),
    );

    expect(
      servicioUsuarios
        .leerUsuarios,
    ).toHaveBeenCalled();

    expect(
      servicioUsuarios
        .guardarSesion,
    ).toHaveBeenCalledWith(
      cliente,
    );
  });
});
