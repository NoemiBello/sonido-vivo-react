import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import Registro from "./Registro";
import { registrar } from "../services/authService";
import { crearUsuario } from "../services/usuariosService";
import { guardarSesion } from "../utils/storage";

vi.mock("../services/authService", () => ({ registrar: vi.fn() }));
vi.mock("../services/usuariosService", () => ({ crearUsuario: vi.fn() }));
vi.mock("../utils/storage", () => ({ guardarSesion: vi.fn() }));

const sesion = {
  token: "token-prueba",
  correo: "manuel@correo.cl",
  rol: "USER",
};

async function completar() {
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
  await user.type(screen.getByLabelText("Correo"), "manuel@correo.cl");
  await user.type(screen.getByLabelText("Contraseña"), "123456");
  await user.type(screen.getByLabelText("Confirmar contraseña"), "123456");
  await user.click(screen.getByRole("button", { name: "Crear cuenta" }));
}

describe("registro de usuarios", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("crea la cuenta y después guarda los datos personales", async () => {
    registrar.mockResolvedValue(sesion);
    crearUsuario.mockResolvedValue({ id: 8 });

    await completar();

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

    expect(guardarSesion).toHaveBeenLastCalledWith({ ...sesion, id: 8 });
  });

  it("muestra el error del backend si el correo está repetido", async () => {
    registrar.mockRejectedValue(new Error("El correo ya está registrado"));

    await completar();

    expect(
      await screen.findByText("El correo ya está registrado"),
    ).toBeInTheDocument();
    expect(crearUsuario).not.toHaveBeenCalled();
    expect(guardarSesion).not.toHaveBeenCalled();
  });

  it("mantiene la sesión si solo falla el guardado de los datos", async () => {
    registrar.mockResolvedValue(sesion);
    crearUsuario.mockRejectedValue(new Error("sin conexión"));

    await completar();

    expect(await screen.findByText("Página de perfil")).toBeInTheDocument();
    expect(guardarSesion).toHaveBeenCalled();
  });
});
