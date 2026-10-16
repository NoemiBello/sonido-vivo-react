import {
  describe,
  expect,
  it,
} from "vitest";
import {
  render,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Servicios from "../components/Servicios";

describe("formulario de servicios", () => {
  it("rechaza una solicitud con datos inválidos", async () => {
    const usuario =
      userEvent.setup();

    render(<Servicios />);

    await usuario.click(
      screen.getByRole(
        "button",
        {
          name:
            "Validar solicitud",
        },
      ),
    );

    expect(
      screen.getByText(
        "Ingresa un nombre de al menos 3 caracteres.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Selecciona un instrumento.",
      ),
    ).toBeInTheDocument();
  });

  it("acepta una solicitud con datos válidos", async () => {
    const usuario =
      userEvent.setup();

    render(<Servicios />);

    await usuario.type(
      screen.getByLabelText(
        "Nombre completo",
      ),
      "Manuel Rodríguez",
    );

    await usuario.type(
      screen.getByLabelText(
        "Correo electrónico",
      ),
      "manuel@correo.cl",
    );

    await usuario.type(
      screen.getByLabelText(
        "Teléfono",
      ),
      "912345678",
    );

    await usuario.selectOptions(
      screen.getByLabelText(
        "Tipo de instrumento",
      ),
      "guitarra-electrica",
    );

    await usuario.type(
      screen.getByLabelText(
        "Descripción del problema",
      ),
      "La guitarra presenta ruido al tocar algunas cuerdas.",
    );

    await usuario.click(
      screen.getByLabelText(
        "Confirmo que los datos ingresados son ficticios.",
      ),
    );

    await usuario.click(
      screen.getByRole(
        "button",
        {
          name:
            "Validar solicitud",
        },
      ),
    );

    expect(
      screen.getByText(
        "Solicitud validada correctamente.",
      ),
    ).toBeInTheDocument();
  });
});
