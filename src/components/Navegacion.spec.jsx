import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import Navegacion from "./Navegacion";
import { renovarToken } from "../services/authService";
import { cerrarSesion, guardarSesion, leerSesion } from "../utils/storage";

vi.mock("../services/authService", () => ({ renovarToken: vi.fn() }));

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
    const nueva = { token: "nuevo", correo: "camila@sonidovivo.cl", rol: "USER" };

    leerSesion.mockReturnValue({
      id: 3,
      rol: "USER",
      inicio: Date.now() - 31 * MINUTO,
    });
    renovarToken.mockResolvedValue(nueva);

    renderMenu();

    await waitFor(() =>
      expect(guardarSesion).toHaveBeenCalledWith({ ...nueva, id: 3 }),
    );
  });

  it("cierra la sesión si el token ya no se puede renovar", async () => {
    leerSesion.mockReturnValue({
      rol: "USER",
      inicio: Date.now() - 90 * MINUTO,
    });
    renovarToken.mockRejectedValue(new Error("Token inválido o expirado"));

    renderMenu();

    await waitFor(() => expect(cerrarSesion).toHaveBeenCalledTimes(1));
  });
});
