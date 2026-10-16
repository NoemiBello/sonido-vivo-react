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
import AdminUsuarios from "../pages/admin/AdminUsuarios";

const usuarioBase = {
  id: 1,
  nombre: "Camila",
  apellido: "Soto",
  correo:
    "camila@sonidovivo.cl",
  password: "123456",
  rol: "cliente",
  activo: true,
};

describe("administración de usuarios", () => {
  it("crea un usuario con un servicio simulado", async () => {
    const usuario =
      userEvent.setup();

    const servicioUsuarios = {
      leerUsuarios: vi.fn(
        () => [usuarioBase],
      ),
      guardarUsuarios: vi.fn(),
    };

    render(
      <AdminUsuarios
        servicioUsuarios={
          servicioUsuarios
        }
      />,
    );

    await usuario.type(
      screen.getByLabelText(
        "Nombre",
      ),
      "Daniela",
    );

    await usuario.type(
      screen.getByLabelText(
        "Apellido",
      ),
      "Pérez",
    );

    await usuario.type(
      screen.getByLabelText(
        "Correo",
      ),
      "daniela@correo.cl",
    );

    await usuario.selectOptions(
      screen.getByLabelText(
        "Rol",
      ),
      "vendedor",
    );

    await usuario.click(
      screen.getByRole(
        "button",
        { name: "Crear usuario" },
      ),
    );

    expect(
      servicioUsuarios
        .guardarUsuarios,
    ).toHaveBeenCalledTimes(1);

    expect(
      screen.getByText(
        "daniela@correo.cl",
      ),
    ).toBeInTheDocument();
  });

  it("edita un usuario existente", async () => {
    const usuario =
      userEvent.setup();

    const servicioUsuarios = {
      leerUsuarios: vi.fn(
        () => [usuarioBase],
      ),
      guardarUsuarios: vi.fn(),
    };

    render(
      <AdminUsuarios
        servicioUsuarios={
          servicioUsuarios
        }
      />,
    );

    await usuario.click(
      screen.getByRole(
        "button",
        { name: "Editar" },
      ),
    );

    const nombre =
      screen.getByLabelText(
        "Nombre",
      );

    await usuario.clear(nombre);

    await usuario.type(
      nombre,
      "Camila Editada",
    );

    await usuario.click(
      screen.getByRole(
        "button",
        {
          name:
            "Guardar cambios",
        },
      ),
    );

    expect(
      servicioUsuarios
        .guardarUsuarios,
    ).toHaveBeenCalledWith([
      expect.objectContaining({
        id: 1,
        nombre:
          "Camila Editada",
      }),
    ]);
  });
});
