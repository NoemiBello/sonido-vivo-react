import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import Perfil from "./Perfil";
import {
  actualizarUsuario,
  buscarUsuarioPorCorreo,
  crearUsuario,
} from "../services/usuariosService";
import { listarSolicitudesPorCorreo } from "../services/serviciosTecnicosService";
import { leerSesion } from "../utils/storage";

vi.mock("../services/usuariosService", () => ({
  actualizarUsuario: vi.fn(),
  buscarUsuarioPorCorreo: vi.fn(),
  crearUsuario: vi.fn(),
}));

vi.mock("../services/serviciosTecnicosService", () => ({
  listarSolicitudesPorCorreo: vi.fn(),
}));

vi.mock("../utils/storage", () => ({
  cerrarSesion: vi.fn(),
  leerSesion: vi.fn(),
}));

const ficha = {
  id: 3,
  correo: "camila@sonidovivo.cl",
  nombre: "Camila",
  apellido: "Soto",
  telefono: null,
  direccion: null,
};

function renderPerfil() {
  return render(
    <MemoryRouter initialEntries={["/perfil"]}>
      <Routes>
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/login" element={<p>Página de login</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("perfil de usuario", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    leerSesion.mockReturnValue({
      correo: "camila@sonidovivo.cl",
      rol: "USER",
    });

    listarSolicitudesPorCorreo.mockResolvedValue([
      {
        id: 1,
        instrumento: "bajo",
        fechaSolicitud: "2026-11-24",
        estado: "PENDIENTE",
      },
    ]);
  });

  it("muestra los datos y las solicitudes del usuario de la sesión", async () => {
    buscarUsuarioPorCorreo.mockResolvedValue(ficha);

    renderPerfil();

    expect(await screen.findByText("PENDIENTE")).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre")).toHaveValue("Camila");
    expect(buscarUsuarioPorCorreo).toHaveBeenCalledWith(
      "camila@sonidovivo.cl",
    );
  });

  it("actualiza los datos existentes", async () => {
    const user = userEvent.setup();
    buscarUsuarioPorCorreo.mockResolvedValue(ficha);
    actualizarUsuario.mockResolvedValue({ ...ficha, telefono: "912345678" });

    renderPerfil();

    await screen.findByText("Teléfono");
    await user.type(screen.getByLabelText("Teléfono"), "912345678");
    await user.click(screen.getByRole("button", { name: "Guardar datos" }));

    expect(await screen.findByText("Datos guardados.")).toBeInTheDocument();
    expect(actualizarUsuario).toHaveBeenCalledWith(
      3,
      expect.objectContaining({ telefono: "912345678" }),
    );
  });

  it("crea los datos si la cuenta todavía no los tiene", async () => {
    const user = userEvent.setup();
    buscarUsuarioPorCorreo.mockResolvedValue(null);
    crearUsuario.mockResolvedValue({ ...ficha, telefono: "", direccion: "" });

    renderPerfil();

    await screen.findByText("Nombre");
    await user.type(screen.getByLabelText("Nombre"), "Camila");
    await user.type(screen.getByLabelText("Apellido"), "Soto");
    await user.click(screen.getByRole("button", { name: "Guardar datos" }));

    expect(await screen.findByText("Datos guardados.")).toBeInTheDocument();
    expect(crearUsuario).toHaveBeenCalledTimes(1);
    expect(actualizarUsuario).not.toHaveBeenCalled();
  });

  it("vuelve al login si la sesión ya se cerró", async () => {
    leerSesion.mockReturnValue(null);
    buscarUsuarioPorCorreo.mockResolvedValue(null);

    renderPerfil();

    expect(await screen.findByText("Página de login")).toBeInTheDocument();
  });
});
