import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import RutaProtegida from "./RutaProtegida";
import { leerSesion } from "../utils/storage";

vi.mock("../utils/storage", () => ({ leerSesion: vi.fn() }));

function renderRuta() {
  return render(
    <MemoryRouter initialEntries={["/admin"]}>
      <Routes>
        <Route element={<RutaProtegida roles={["ADMIN"]} />}>
          <Route path="/admin" element={<p>Panel privado</p>} />
        </Route>
        <Route path="/login" element={<p>Página de login</p>} />
        <Route path="/vendedor" element={<p>Panel del vendedor</p>} />
        <Route path="/perfil" element={<p>Página de perfil</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ruta protegida", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("envía al login si no hay sesión", () => {
    leerSesion.mockReturnValue(null);
    renderRuta();
    expect(screen.getByText("Página de login")).toBeInTheDocument();
  });

  it("muestra la página si el rol está permitido", () => {
    leerSesion.mockReturnValue({ rol: "ADMIN" });
    renderRuta();
    expect(screen.getByText("Panel privado")).toBeInTheDocument();
  });

  it("envía al vendedor a su panel", () => {
    leerSesion.mockReturnValue({ rol: "VENDEDOR" });
    renderRuta();
    expect(screen.getByText("Panel del vendedor")).toBeInTheDocument();
  });

  it("envía al cliente a su perfil", () => {
    leerSesion.mockReturnValue({ rol: "USER" });
    renderRuta();
    expect(screen.getByText("Página de perfil")).toBeInTheDocument();
  });
});
