import {
  beforeEach,
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

import Login from "./Login";
import {
  guardarSesion,
  leerUsuarios,
} from "../utils/storage";

vi.mock("../utils/storage", () => ({
  leerUsuarios: vi.fn(),
  guardarSesion: vi.fn(),
}));

describe("inicio de sesión", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rechaza credenciales incorrectas", async () => {
    const user = userEvent.setup();

    leerUsuarios.mockReturnValue([]);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    await user.type(
      screen.getByLabelText("Correo"),
      "incorrecto@correo.cl",
    );

    await user.type(
      screen.getByLabelText("Contraseña"),
      "000000",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Ingresar",
      }),
    );

    expect(
      screen.getByText(
        "Correo o contraseña incorrectos.",
      ),
    ).toBeInTheDocument();

    expect(
      guardarSesion,
    ).not.toHaveBeenCalled();
  });

  it("guarda la sesión cuando las credenciales son válidas", async () => {
    const user = userEvent.setup();

    const cliente = {
      id: 1,
      nombre: "Camila",
      apellido: "Soto",
      correo: "camila@sonidovivo.cl",
      password: "123456",
      rol: "cliente",
      activo: true,
    };

    leerUsuarios.mockReturnValue([
      cliente,
    ]);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    await user.type(
      screen.getByLabelText("Correo"),
      cliente.correo,
    );

    await user.type(
      screen.getByLabelText("Contraseña"),
      cliente.password,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Ingresar",
      }),
    );

    expect(
      guardarSesion,
    ).toHaveBeenCalledWith(cliente);
  });
});