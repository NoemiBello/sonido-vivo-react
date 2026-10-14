import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminUsuarios from "../pages/admin/AdminUsuarios";

describe("administración de usuarios", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("crea un usuario desde el formulario administrativo", async () => {
    const user = userEvent.setup();

    render(<AdminUsuarios />);

    await user.type(screen.getByLabelText("Nombre"), "Daniela");
    await user.type(screen.getByLabelText("Apellido"), "Pérez");
    await user.type(screen.getByLabelText("Correo"), "daniela@correo.cl");

    await user.selectOptions(
      screen.getByLabelText("Rol"),
      "vendedor",
    );

    await user.click(
      screen.getByRole("button", { name: "Crear usuario" }),
    );

    expect(
      screen.getByText("daniela@correo.cl"),
    ).toBeInTheDocument();

    const usuarios = JSON.parse(
      localStorage.getItem("svReactUsuarios"),
    );

    expect(
      usuarios.some(
        (usuario) =>
          usuario.correo === "daniela@correo.cl" &&
          usuario.rol === "vendedor",
      ),
    ).toBe(true);
  });
});
