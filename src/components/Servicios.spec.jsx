import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Servicios from "./Servicios";
import { crearSolicitud } from "../services/serviciosTecnicosService";

vi.mock("../services/serviciosTecnicosService", () => ({
  crearSolicitud: vi.fn(),
}));

describe("formulario de servicios", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rechaza una solicitud con datos inválidos", async () => {
    const user = userEvent.setup();

    render(<Servicios />);

    await user.click(
      screen.getByRole("button", { name: "Enviar solicitud" }),
    );

    expect(
      screen.getByText(
        "Ingresa un nombre de al menos 3 caracteres.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Selecciona un instrumento."),
    ).toBeInTheDocument();

    expect(crearSolicitud).not.toHaveBeenCalled();
  });

  it("envía una solicitud con datos válidos", async () => {
    const user = userEvent.setup();
    crearSolicitud.mockResolvedValue({ id: 4, estado: "PENDIENTE" });

    render(<Servicios />);

    await user.type(
      screen.getByLabelText("Nombre completo"),
      "Manuel Rodríguez",
    );

    await user.type(
      screen.getByLabelText("Correo electrónico"),
      "manuel@correo.cl",
    );

    await user.type(
      screen.getByLabelText("Teléfono"),
      "912345678",
    );

    await user.selectOptions(
      screen.getByLabelText("Tipo de instrumento"),
      "guitarra-electrica",
    );

    await user.type(
      screen.getByLabelText("Descripción del problema"),
      "La guitarra presenta ruido al tocar algunas cuerdas.",
    );

    await user.click(
      screen.getByLabelText(
        "Confirmo que los datos ingresados son ficticios.",
      ),
    );

    await user.click(
      screen.getByRole("button", { name: "Enviar solicitud" }),
    );

    expect(
      await screen.findByText("Solicitud N° 4 recibida. Estado: PENDIENTE."),
    ).toBeInTheDocument();

    expect(crearSolicitud).toHaveBeenCalledWith({
      nombre: "Manuel Rodríguez",
      correo: "manuel@correo.cl",
      telefono: "912345678",
      instrumento: "guitarra-electrica",
      descripcion: "La guitarra presenta ruido al tocar algunas cuerdas.",
    });
  });
});
