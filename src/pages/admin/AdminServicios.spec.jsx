import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import AdminServicios from "./AdminServicios";
import {
  cambiarEstadoSolicitud,
  eliminarSolicitud,
  listarSolicitudes,
} from "../../services/serviciosTecnicosService";
import { leerSesion } from "../../utils/storage";

vi.mock("../../services/serviciosTecnicosService", () => ({
  cambiarEstadoSolicitud: vi.fn(),
  eliminarSolicitud: vi.fn(),
  listarSolicitudes: vi.fn(),
}));

vi.mock("../../utils/storage", () => ({ leerSesion: vi.fn() }));

function renderServicios() {
  return render(
    <MemoryRouter>
      <AdminServicios />
    </MemoryRouter>,
  );
}

const solicitud = {
  id: 1,
  nombre: "Camila Soto",
  correo: "camila@sonidovivo.cl",
  telefono: "912345678",
  instrumento: "bajo",
  descripcion: "El jack hace ruido.",
  estado: "PENDIENTE",
  fechaSolicitud: "2026-11-24",
};

describe("administración de servicios técnicos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    leerSesion.mockReturnValue({ rol: "ADMIN" });
    listarSolicitudes.mockResolvedValue([solicitud]);
  });

  it("avanza la solicitud al siguiente estado", async () => {
    const user = userEvent.setup();
    cambiarEstadoSolicitud.mockResolvedValue({
      ...solicitud,
      estado: "EN_REVISION",
    });

    renderServicios();

    await user.click(await screen.findByText("Pasar a EN_REVISION"));

    expect(cambiarEstadoSolicitud).toHaveBeenCalledWith(1, "EN_REVISION");
    expect(
      await screen.findByText("Pasar a EN_REPARACION"),
    ).toBeInTheDocument();
  });

  it("no permite avanzar una solicitud entregada", async () => {
    listarSolicitudes.mockResolvedValue([
      { ...solicitud, estado: "ENTREGADO" },
    ]);

    renderServicios();

    expect(await screen.findByText("ENTREGADO")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Pasar a/ }),
    ).not.toBeInTheDocument();
  });

  it("elimina la solicitud después de confirmar", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    eliminarSolicitud.mockResolvedValue(null);

    renderServicios();

    await user.click(await screen.findByText("Eliminar"));

    expect(eliminarSolicitud).toHaveBeenCalledWith(1);
    expect(
      await screen.findByText("No hay solicitudes registradas."),
    ).toBeInTheDocument();
  });
});
