import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import Login from "./Login";
import { login } from "../services/authService";
import { buscarUsuarioPorCorreo } from "../services/usuariosService";
import { guardarSesion } from "../utils/storage";

vi.mock("../services/authService", () => ({ login: vi.fn() }));

vi.mock("../services/usuariosService", () => ({
  buscarUsuarioPorCorreo: vi.fn(),
}));

vi.mock("../utils/storage", () => ({ guardarSesion: vi.fn() }));

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<p>Página de perfil</p>} />
        <Route path="/admin" element={<p>Página de administración</p>} />
        <Route path="/vendedor" element={<p>Página del vendedor</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

async function ingresar(correo, password) {
  const user = userEvent.setup();

  if (correo) {
    await user.type(screen.getByLabelText("Correo"), correo);
  }

  if (password) {
    await user.type(screen.getByLabelText("Contraseña"), password);
  }

  await user.click(screen.getByRole("button", { name: "Ingresar" }));
}

describe("inicio de sesión", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    buscarUsuarioPorCorreo.mockResolvedValue({ id: 3 });
  });

  it("muestra errores personalizados cuando el formulario está vacío", async () => {
    renderLogin();
    await ingresar();

    expect(screen.getByText("Ingresa tu correo.")).toBeInTheDocument();
    expect(screen.getByText("Ingresa tu contraseña.")).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  it("rechaza un correo con formato inválido", async () => {
    renderLogin();
    await ingresar("correo-invalido", "123456");

    expect(screen.getByText("Ingresa un correo válido.")).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  it("rechaza una contraseña demasiado corta", async () => {
    renderLogin();
    await ingresar("cliente@correo.cl", "123");

    expect(
      screen.getByText("La contraseña debe tener al menos 6 caracteres."),
    ).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  it("muestra el mensaje del backend si las credenciales son incorrectas", async () => {
    login.mockRejectedValue(new Error("Credenciales inválidas"));

    renderLogin();
    await ingresar("incorrecto@correo.cl", "000000");

    expect(
      await screen.findByText("Credenciales inválidas"),
    ).toBeInTheDocument();
    expect(guardarSesion).not.toHaveBeenCalled();
  });

  it("guarda el token y lleva al cliente a su perfil", async () => {
    login.mockResolvedValue({
      token: "token-prueba",
      correo: "camila@sonidovivo.cl",
      rol: "USER",
    });

    renderLogin();
    await ingresar("camila@sonidovivo.cl", "123456");

    expect(await screen.findByText("Página de perfil")).toBeInTheDocument();

    expect(login).toHaveBeenCalledWith({
      correo: "camila@sonidovivo.cl",
      password: "123456",
    });

    expect(guardarSesion).toHaveBeenLastCalledWith({
      token: "token-prueba",
      correo: "camila@sonidovivo.cl",
      rol: "USER",
      id: 3,
    });
  });

  it("lleva al administrador a su panel aunque no tenga ficha", async () => {
    buscarUsuarioPorCorreo.mockRejectedValue(new Error("sin conexión"));

    login.mockResolvedValue({
      token: "token-admin",
      correo: "admin@sonidovivo.cl",
      rol: "ADMIN",
    });

    renderLogin();
    await ingresar("admin@sonidovivo.cl", "123456");

    expect(
      await screen.findByText("Página de administración"),
    ).toBeInTheDocument();
  });

  it("lleva al vendedor a su panel", async () => {
    login.mockResolvedValue({
      token: "token-vendedor",
      correo: "vendedor@sonidovivo.cl",
      rol: "VENDEDOR",
    });

    renderLogin();
    await ingresar("vendedor@sonidovivo.cl", "123456");

    expect(await screen.findByText("Página del vendedor")).toBeInTheDocument();
  });
});
