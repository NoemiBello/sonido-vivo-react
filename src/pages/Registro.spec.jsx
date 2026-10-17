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

import Registro from "./Registro";
import {
  guardarUsuarios,
  leerUsuarios,
} from "../utils/storage";

vi.mock("../utils/storage", () => ({
  leerUsuarios: vi.fn(),
  guardarUsuarios: vi.fn(),
}));

describe("registro de usuarios", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    leerUsuarios.mockReturnValue([]);
  });

  it("guarda un usuario válido utilizando funciones simuladas", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>,
    );

    await user.type(
      screen.getByLabelText("Nombre"),
      "Manuel",
    );

    await user.type(
      screen.getByLabelText("Apellido"),
      "Rodríguez",
    );

    await user.type(
      screen.getByLabelText("Correo"),
      "manuel@correo.cl",
    );

    await user.type(
      screen.getByLabelText("Contraseña"),
      "123456",
    );

    await user.type(
      screen.getByLabelText(
        "Confirmar contraseña",
      ),
      "123456",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Crear cuenta",
      }),
    );

    expect(
      guardarUsuarios,
    ).toHaveBeenCalledTimes(1);

    expect(
      guardarUsuarios,
    ).toHaveBeenCalledWith([
      expect.objectContaining({
        nombre: "Manuel",
        apellido: "Rodríguez",
        correo: "manuel@correo.cl",
        rol: "cliente",
        activo: true,
      }),
    ]);
  });
});