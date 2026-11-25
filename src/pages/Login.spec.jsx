import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import Login from "./Login";
import { login } from "../services/authService";
import { guardarSesion } from "../utils/storage";

// El backend simulado rechaza la clave 000000 y acepta cualquier otra.
vi.mock("../services/authService", () => ({
  login: vi.fn(async ({ correo, password }) => {
    if (password === "000000") {
      throw new Error("Credenciales inválidas");
    }

    const roles = {
      "admin@sonidovivo.cl": "ADMIN",
      "vendedor@sonidovivo.cl": "VENDEDOR",
    };

    return { token: "token-prueba", correo, rol: roles[correo] || "USER" };
  }),
}));

vi.mock("../services/usuariosService", () => ({
  buscarUsuarioPorCorreo: vi.fn(async (correo) => {
    if (correo === "admin@sonidovivo.cl") {
      throw new Error("sin conexión");
    }

    return { id: 3 };
  }),
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
    renderLogin();
    await ingresar("incorrecto@correo.cl", "000000");

    expect(
      await screen.findByText("Credenciales inválidas"),
    ).toBeInTheDocument();
    expect(guardarSesion).not.toHaveBeenCalled();
  });

  it("guarda el token y lleva al cliente a su perfil", async () => {
    renderLogin();
    await ingresar("camila@sonidovivo.cl", "123456");

    expect(await screen.findByText("Página de perfil")).toBeInTheDocument();

    expect(login).toHaveBeenCalledWith({
      correo: "camila@sonidovivo.cl",
      password: "123456",
    });

    expect(guardarSesion).toHaveBeenCalledWith({
      token: "token-prueba",
      correo: "camila@sonidovivo.cl",
      rol: "USER",
      id: 3,
    });
  });

  it("lleva al administrador a su panel aunque no tenga ficha", async () => {
    renderLogin();
    await ingresar("admin@sonidovivo.cl", "123456");

    expect(
      await screen.findByText("Página de administración"),
    ).toBeInTheDocument();
  });

  it("lleva al vendedor a su panel", async () => {
    renderLogin();
    await ingresar("vendedor@sonidovivo.cl", "123456");

    expect(await screen.findByText("Página del vendedor")).toBeInTheDocument();
  });
});
