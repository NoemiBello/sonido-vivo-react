import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AdminServicios from "./AdminServicios";
import {
  cambiarEstadoSolicitud,
  eliminarSolicitud,
  listarSolicitudes,
} from "../../services/serviciosTecnicosService";

vi.mock("../../services/serviciosTecnicosService", () => ({
  cambiarEstadoSolicitud: vi.fn(),
  eliminarSolicitud: vi.fn(),
  listarSolicitudes: vi.fn(),
}));

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
    listarSolicitudes.mockResolvedValue([solicitud]);
  });

  it("avanza la solicitud al siguiente estado", async () => {
    const user = userEvent.setup();
    cambiarEstadoSolicitud.mockResolvedValue({
      ...solicitud,
      estado: "EN_REVISION",
    });

    render(<AdminServicios />);

    await user.click(
      await screen.findByRole("button", { name: "Pasar a EN_REVISION" }),
    );

    expect(cambiarEstadoSolicitud).toHaveBeenCalledWith(1, "EN_REVISION");
    expect(
      await screen.findByRole("button", { name: "Pasar a EN_REPARACION" }),
    ).toBeInTheDocument();
  });

  it("no permite avanzar una solicitud entregada", async () => {
    listarSolicitudes.mockResolvedValue([
      { ...solicitud, estado: "ENTREGADO" },
    ]);

    render(<AdminServicios />);

    expect(await screen.findByText("ENTREGADO")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Pasar a/ }),
    ).not.toBeInTheDocument();
  });

  it("elimina la solicitud después de confirmar", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    eliminarSolicitud.mockResolvedValue(null);

    render(<AdminServicios />);

    await user.click(await screen.findByRole("button", { name: "Eliminar" }));

    expect(eliminarSolicitud).toHaveBeenCalledWith(1);
    expect(
      await screen.findByText("No hay solicitudes registradas."),
    ).toBeInTheDocument();
  });
});
