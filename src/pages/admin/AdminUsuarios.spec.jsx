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

import AdminUsuarios from "./AdminUsuarios";
import {
  guardarUsuarios,
  leerUsuarios,
} from "../../utils/storage";

vi.mock("../../utils/storage", () => ({
  leerUsuarios: vi.fn(),
  guardarUsuarios: vi.fn(),
}));

const usuarioBase = {
  id: 1,
  nombre: "Camila",
  apellido: "Soto",
  correo: "camila@sonidovivo.cl",
  password: "123456",
  rol: "cliente",
  activo: true,
};

describe("administración de usuarios", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    leerUsuarios.mockReturnValue([
      usuarioBase,
    ]);
  });

  it("crea un usuario utilizando funciones simuladas", async () => {
    const user = userEvent.setup();

    render(<AdminUsuarios />);

    await user.type(
      screen.getByLabelText("Nombre"),
      "Daniela",
    );

    await user.type(
      screen.getByLabelText("Apellido"),
      "Pérez",
    );

    await user.type(
      screen.getByLabelText("Correo"),
      "daniela@correo.cl",
    );

    await user.selectOptions(
      screen.getByLabelText("Rol"),
      "vendedor",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Crear usuario",
      }),
    );

    expect(
      guardarUsuarios,
    ).toHaveBeenCalledTimes(1);

    expect(
      guardarUsuarios,
    ).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          nombre: "Daniela",
          apellido: "Pérez",
          correo: "daniela@correo.cl",
          rol: "vendedor",
        }),
      ]),
    );
  });

  it("permite editar un usuario existente", async () => {
    const user = userEvent.setup();

    render(<AdminUsuarios />);

    await user.click(
      screen.getByRole("button", {
        name: "Editar",
      }),
    );

    const nombre =
      screen.getByLabelText("Nombre");

    await user.clear(nombre);

    await user.type(
      nombre,
      "Camila Editada",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Guardar cambios",
      }),
    );

    expect(
      guardarUsuarios,
    ).toHaveBeenCalledWith([
      expect.objectContaining({
        id: 1,
        nombre: "Camila Editada",
      }),
    ]);
  });
});