import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Servicios from "../components/Servicios";

describe("formulario de servicios", () => {
  it("rechaza una solicitud con datos inválidos", async () => {
    const user = userEvent.setup();

    render(<Servicios />);

    await user.click(
      screen.getByRole("button", { name: "Validar solicitud" }),
    );

    expect(
      screen.getByText(
        "Ingresa un nombre de al menos 3 caracteres.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Selecciona un instrumento."),
    ).toBeInTheDocument();
  });

  it("acepta una solicitud con datos válidos", async () => {
    const user = userEvent.setup();

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
      screen.getByRole("button", { name: "Validar solicitud" }),
    );

    expect(
      screen.getByText("Solicitud validada correctamente."),
    ).toBeInTheDocument();
  });
});
