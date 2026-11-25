import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import Navegacion from "./Navegacion";
import { renovarToken } from "../services/authService";
import { cerrarSesion, guardarSesion, leerSesion } from "../utils/storage";

const nueva = { token: "nuevo", correo: "camila@sonidovivo.cl", rol: "USER" };

// El backend simulado rechaza la renovación cuando el token ya venció.
let tokenVencido = false;

vi.mock("../services/authService", () => ({
  renovarToken: vi.fn(async () => {
    if (tokenVencido) {
      throw new Error("Token inválido o expirado");
    }

    return nueva;
  }),
}));

vi.mock("../utils/storage", () => ({
  cerrarSesion: vi.fn(),
  guardarSesion: vi.fn(),
  leerSesion: vi.fn(),
}));

const MINUTO = 60 * 1000;

function renderMenu() {
  return render(
    <MemoryRouter>
      <Navegacion carrito={[]} setCarrito={vi.fn()} />
      <Routes>
        <Route path="/" element={<p>Página de inicio</p>} />
        <Route path="/login" element={<p>Página de login</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("menú según el rol", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra Ingresar si no hay sesión", () => {
    leerSesion.mockReturnValue(null);
    renderMenu();

    expect(screen.getByText("Ingresar")).toBeInTheDocument();
    expect(screen.queryByText("Cerrar sesión")).not.toBeInTheDocument();
  });

  it("muestra la tienda y el perfil al cliente", () => {
    leerSesion.mockReturnValue({ rol: "USER", inicio: Date.now() });
    renderMenu();

    expect(screen.getByText("Catálogo")).toBeInTheDocument();
    expect(screen.getByText("Perfil")).toBeInTheDocument();
  });

  it("oculta la tienda y el carrito al vendedor", () => {
    leerSesion.mockReturnValue({ rol: "VENDEDOR", inicio: Date.now() });
    renderMenu();

    expect(screen.getByText("Panel")).toBeInTheDocument();
    expect(screen.queryByText("Catálogo")).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText("Abrir o cerrar carrito de compras"),
    ).not.toBeInTheDocument();
  });

  it("cierra la sesión", async () => {
    const user = userEvent.setup();
    leerSesion.mockReturnValue({ rol: "USER", inicio: Date.now() });
    renderMenu();

    await user.click(screen.getByText("Cerrar sesión"));

    expect(cerrarSesion).toHaveBeenCalledTimes(1);
  });
});

describe("renovación del token", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("no renueva un token reciente", () => {
    leerSesion.mockReturnValue({ rol: "USER", inicio: Date.now() });
    renderMenu();

    expect(renovarToken).not.toHaveBeenCalled();
  });

  it("renueva un token con más de 30 minutos", async () => {
    leerSesion.mockReturnValue({
      id: 3,
      rol: "USER",
      inicio: Date.now() - 31 * MINUTO,
    });

    renderMenu();

    // Se espera la respuesta simulada antes de comprobar lo guardado.
    expect(renovarToken).toHaveBeenCalledTimes(1);
    await renovarToken();

    expect(guardarSesion).toHaveBeenCalledWith({ ...nueva, id: 3 });
  });

  it("cierra la sesión si el token ya no se puede renovar", async () => {
    leerSesion.mockReturnValue({
      rol: "USER",
      inicio: Date.now() - 90 * MINUTO,
    });
    tokenVencido = true;

    renderMenu();

    expect(await screen.findByText("Página de login")).toBeInTheDocument();
    expect(cerrarSesion).toHaveBeenCalled();
  });
});
