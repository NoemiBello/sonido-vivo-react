import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
  MemoryRouter,
} from "react-router-dom";

import Login from "./Login";

import {
  guardarSesion,
  leerUsuarios,
} from "../utils/storage";

vi.mock(
  "../utils/storage",
  () => ({
    leerUsuarios:
      vi.fn(),

    guardarSesion:
      vi.fn(),
  }),
);

describe(
  "inicio de sesión",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it(
      "muestra errores personalizados cuando el formulario está vacío",
      async () => {
        const user =
          userEvent.setup();

        render(
          <MemoryRouter>
            <Login />
          </MemoryRouter>,
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Ingresar",
            },
          ),
        );

        expect(
          screen.getByText(
            "Ingresa tu correo.",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Ingresa tu contraseña.",
          ),
        ).toBeInTheDocument();

        expect(
          leerUsuarios,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "rechaza un correo con formato inválido",
      async () => {
        const user =
          userEvent.setup();

        render(
          <MemoryRouter>
            <Login />
          </MemoryRouter>,
        );

        await user.type(
          screen.getByLabelText(
            "Correo",
          ),
          "correo-invalido",
        );

        await user.type(
          screen.getByLabelText(
            "Contraseña",
          ),
          "123456",
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Ingresar",
            },
          ),
        );

        expect(
          screen.getByText(
            "Ingresa un correo válido.",
          ),
        ).toBeInTheDocument();

        expect(
          leerUsuarios,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "rechaza una contraseña demasiado corta",
      async () => {
        const user =
          userEvent.setup();

        render(
          <MemoryRouter>
            <Login />
          </MemoryRouter>,
        );

        await user.type(
          screen.getByLabelText(
            "Correo",
          ),
          "cliente@correo.cl",
        );

        await user.type(
          screen.getByLabelText(
            "Contraseña",
          ),
          "123",
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Ingresar",
            },
          ),
        );

        expect(
          screen.getByText(
            "La contraseña debe tener al menos 6 caracteres.",
          ),
        ).toBeInTheDocument();

        expect(
          leerUsuarios,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "rechaza credenciales incorrectas",
      async () => {
        const user =
          userEvent.setup();

        leerUsuarios.mockReturnValue(
          [],
        );

        render(
          <MemoryRouter>
            <Login />
          </MemoryRouter>,
        );

        await user.type(
          screen.getByLabelText(
            "Correo",
          ),
          "incorrecto@correo.cl",
        );

        await user.type(
          screen.getByLabelText(
            "Contraseña",
          ),
          "000000",
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Ingresar",
            },
          ),
        );

        expect(
          screen.getByText(
            "Correo o contraseña incorrectos.",
          ),
        ).toBeInTheDocument();

        expect(
          guardarSesion,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "guarda la sesión cuando las credenciales son válidas",
      async () => {
        const user =
          userEvent.setup();

        const cliente = {
          id: 1,
          nombre:
            "Camila",
          apellido:
            "Soto",
          correo:
            "camila@sonidovivo.cl",
          password:
            "123456",
          rol:
            "cliente",
          activo:
            true,
        };

        leerUsuarios.mockReturnValue(
          [cliente],
        );

        render(
          <MemoryRouter>
            <Login />
          </MemoryRouter>,
        );

        await user.type(
          screen.getByLabelText(
            "Correo",
          ),
          cliente.correo,
        );

        await user.type(
          screen.getByLabelText(
            "Contraseña",
          ),
          cliente.password,
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Ingresar",
            },
          ),
        );

        expect(
          guardarSesion,
        ).toHaveBeenCalledWith(
          cliente,
        );
      },
    );
  },
);