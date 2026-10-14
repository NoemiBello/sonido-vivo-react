import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/Login";

describe("inicio de sesión", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("rechaza credenciales incorrectas", async () => {
    const user = userEvent.setup();

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
      screen.getByRole("button", { name: "Ingresar" }),
    );

    expect(
      screen.getByText("Correo o contraseña incorrectos."),
    ).toBeInTheDocument();
  });

  it("guarda la sesión con credenciales válidas", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    await user.type(
      screen.getByLabelText("Correo"),
      "camila@sonidovivo.cl",
    );

    await user.type(
      screen.getByLabelText("Contraseña"),
      "123456",
    );

    await user.click(
      screen.getByRole("button", { name: "Ingresar" }),
    );

    const sesion = JSON.parse(
      localStorage.getItem("svReactSesion"),
    );

    expect(sesion.correo).toBe("camila@sonidovivo.cl");
    expect(sesion.rol).toBe("cliente");
  });
});
