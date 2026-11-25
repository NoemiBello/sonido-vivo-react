import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import AdminUsuarios from "./AdminUsuarios";
import {
  actualizarCuenta,
  crearCuenta,
  desactivarCuenta,
  listarCuentas,
} from "../../services/authService";
import {
  actualizarUsuario,
  crearUsuario,
  listarUsuarios,
} from "../../services/usuariosService";
import { leerSesion } from "../../utils/storage";

// El backend simulado no permite cambiar la cuenta 99 (último administrador).
vi.mock("../../services/authService", () => ({
  actualizarCuenta: vi.fn(async (id) => {
    if (id === 99) {
      throw new Error("Debe quedar al menos un administrador activo");
    }
  }),
  crearCuenta: vi.fn(),
  desactivarCuenta: vi.fn(),
  listarCuentas: vi.fn(),
}));

vi.mock("../../services/usuariosService", () => ({
  actualizarUsuario: vi.fn(),
  crearUsuario: vi.fn(),
  listarUsuarios: vi.fn(),
}));

vi.mock("../../utils/storage", () => ({ leerSesion: vi.fn() }));

function renderUsuarios() {
  return render(
    <MemoryRouter>
      <AdminUsuarios />
    </MemoryRouter>,
  );
}

const cuenta = {
  id: 7,
  correo: "camila@sonidovivo.cl",
  rol: "USER",
  activo: true,
};

const ficha = {
  id: 3,
  correo: "camila@sonidovivo.cl",
  nombre: "Camila",
  apellido: "Soto",
  telefono: null,
  direccion: null,
};

describe("administración de usuarios", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    leerSesion.mockReturnValue({ correo: "admin@sonidovivo.cl", rol: "ADMIN" });
    listarCuentas.mockResolvedValue([cuenta]);
    listarUsuarios.mockResolvedValue([ficha]);
  });

  it("une la cuenta y los datos personales por el correo", async () => {
    renderUsuarios();

    expect(await screen.findByText("Camila Soto")).toBeInTheDocument();
    expect(screen.getByText("camila@sonidovivo.cl")).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Cliente" })).toBeInTheDocument();
  });

  it("crea la cuenta en auth y los datos en usuarios", async () => {
    const user = userEvent.setup();
    crearCuenta.mockResolvedValue({ id: 9 });
    crearUsuario.mockResolvedValue({ id: 5 });

    renderUsuarios();

    await screen.findByText("Camila Soto");
    await user.type(screen.getByLabelText("Nombre"), "Daniela");
    await user.type(screen.getByLabelText("Apellido"), "Pérez");
    await user.type(screen.getByLabelText("Correo"), "daniela@correo.cl");
    await user.type(screen.getByLabelText("Contraseña"), "123456");
    await user.selectOptions(screen.getByLabelText("Rol"), "VENDEDOR");
    await user.click(screen.getByRole("button", { name: "Crear usuario" }));

    expect(crearCuenta).toHaveBeenCalledWith({
      correo: "daniela@correo.cl",
      password: "123456",
      rol: "VENDEDOR",
    });

    expect(crearUsuario).toHaveBeenCalledWith(
      expect.objectContaining({
        nombre: "Daniela",
        apellido: "Pérez",
        correo: "daniela@correo.cl",
      }),
    );
  });

  it("edita el rol en auth y el nombre en usuarios", async () => {
    const user = userEvent.setup();
    actualizarUsuario.mockResolvedValue(ficha);

    renderUsuarios();

    await user.click(await screen.findByText("Editar"));

    const nombre = screen.getByLabelText("Nombre");
    await user.clear(nombre);
    await user.type(nombre, "Camila Editada");
    await user.selectOptions(screen.getByLabelText("Rol"), "VENDEDOR");
    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(actualizarCuenta).toHaveBeenCalledWith(7, {
      rol: "VENDEDOR",
      activo: true,
    });

    expect(actualizarUsuario).toHaveBeenCalledWith(
      3,
      expect.objectContaining({ nombre: "Camila Editada" }),
    );
  });

  it("desactiva una cuenta después de confirmar", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    desactivarCuenta.mockResolvedValue(null);

    renderUsuarios();

    await user.click(await screen.findByText("Desactivar"));

    expect(desactivarCuenta).toHaveBeenCalledWith(7);
    expect(await screen.findByText("Inactivo")).toBeInTheDocument();
  });

  it("muestra el error si la API rechaza un cambio", async () => {
    const user = userEvent.setup();
    listarCuentas.mockResolvedValue([{ ...cuenta, id: 99 }]);

    renderUsuarios();

    await user.click(await screen.findByText("Editar"));
    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(
      await screen.findByText("Debe quedar al menos un administrador activo"),
    ).toBeInTheDocument();
  });
});
