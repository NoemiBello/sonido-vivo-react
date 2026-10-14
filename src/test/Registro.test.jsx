import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Registro from "../pages/Registro";

describe("registro de usuarios", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("guarda un nuevo usuario válido", async () => {
    const user = userEvent.setup();
    const guardarSpy = vi.spyOn(Storage.prototype, "setItem");

    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText("Nombre"), "Manuel");
    await user.type(screen.getByLabelText("Apellido"), "Rodríguez");
    await user.type(screen.getByLabelText("Correo"), "manuel@correo.cl");
    await user.type(screen.getByLabelText("Contraseña"), "123456");
    await user.type(screen.getByLabelText("Confirmar contraseña"), "123456");

    await user.click(
      screen.getByRole("button", { name: "Crear cuenta" }),
    );

    const usuarios = JSON.parse(
      localStorage.getItem("svReactUsuarios"),
    );

    expect(
      usuarios.some(
        (usuario) => usuario.correo === "manuel@correo.cl",
      ),
    ).toBe(true);

    expect(guardarSpy).toHaveBeenCalled();
    guardarSpy.mockRestore();
  });
});
