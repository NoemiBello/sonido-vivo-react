import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import Registro from "./Registro";
import { registrar } from "../services/authService";
import { crearUsuario } from "../services/usuariosService";
import { guardarSesion } from "../utils/storage";

// El backend simulado rechaza repetido@correo.cl y falla al guardar los datos
// de sindatos@correo.cl.
vi.mock("../services/authService", () => ({
  registrar: vi.fn(async ({ correo }) => {
    if (correo === "repetido@correo.cl") {
      throw new Error("El correo ya está registrado");
    }

    return { token: "token-prueba", correo, rol: "USER" };
  }),
}));

vi.mock("../services/usuariosService", () => ({
  crearUsuario: vi.fn(async ({ correo }) => {
    if (correo === "sindatos@correo.cl") {
      throw new Error("sin conexión");
    }

    return { id: 8 };
  }),
}));

vi.mock("../utils/storage", () => ({ guardarSesion: vi.fn() }));

async function completar(correo) {
  const user = userEvent.setup();

  render(
    <MemoryRouter initialEntries={["/registro"]}>
      <Routes>
        <Route path="/registro" element={<Registro />} />
        <Route path="/perfil" element={<p>Página de perfil</p>} />
      </Routes>
    </MemoryRouter>,
  );

  await user.type(screen.getByLabelText("Nombre"), "Manuel");
  await user.type(screen.getByLabelText("Apellido"), "Rodríguez");
  await user.type(screen.getByLabelText("Correo"), correo);
  await user.type(screen.getByLabelText("Contraseña"), "123456");
  await user.type(screen.getByLabelText("Confirmar contraseña"), "123456");
  await user.click(screen.getByRole("button", { name: "Crear cuenta" }));
}

describe("registro de usuarios", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("crea la cuenta y después guarda los datos personales", async () => {
    await completar("manuel@correo.cl");

    expect(await screen.findByText("Página de perfil")).toBeInTheDocument();

    expect(registrar).toHaveBeenCalledWith({
      correo: "manuel@correo.cl",
      password: "123456",
    });

    expect(crearUsuario).toHaveBeenCalledWith({
      correo: "manuel@correo.cl",
      nombre: "Manuel",
      apellido: "Rodríguez",
    });

    expect(guardarSesion).toHaveBeenCalledWith({
      token: "token-prueba",
      correo: "manuel@correo.cl",
      rol: "USER",
      id: 8,
    });
  });

  it("muestra el error del backend si el correo está repetido", async () => {
    await completar("repetido@correo.cl");

    expect(
      await screen.findByText("El correo ya está registrado"),
    ).toBeInTheDocument();
    expect(crearUsuario).not.toHaveBeenCalled();
    expect(guardarSesion).not.toHaveBeenCalled();
  });

  it("mantiene la sesión si solo falla el guardado de los datos", async () => {
    await completar("sindatos@correo.cl");

    expect(await screen.findByText("Página de perfil")).toBeInTheDocument();
    expect(guardarSesion).toHaveBeenCalled();
  });
});
