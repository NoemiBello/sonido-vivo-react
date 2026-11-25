import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { TiendaContext } from "../context/TiendaContext";
import { ListaProductos, VendedorLayout } from "./Vendedor";
import { leerSesion } from "../utils/storage";

vi.mock("../utils/storage", () => ({
  cerrarSesion: vi.fn(),
  leerSesion: vi.fn(),
}));

const producto = {
  id: 1,
  codigo: "GE001",
  nombre: "Guitarra",
  categoriaId: 1,
  precio: 100000,
  stock: 5,
  stockCritico: 2,
  descuento: 0,
};

function renderPanel() {
  return render(
    <TiendaContext.Provider
      value={{
        productos: [producto],
        categorias: [{ id: 1, nombre: "Guitarras" }],
        eliminarProducto: vi.fn(),
      }}
    >
      <MemoryRouter initialEntries={["/vendedor"]}>
        <Routes>
          <Route path="/vendedor" element={<VendedorLayout />}>
            <Route index element={<ListaProductos />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </TiendaContext.Provider>,
  );
}

describe("vista según el rol", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("el vendedor solo visualiza productos", () => {
    leerSesion.mockReturnValue({ correo: "vendedor@sonidovivo.cl", rol: "VENDEDOR" });
    renderPanel();

    expect(screen.getByText("Guitarra")).toBeInTheDocument();
    expect(screen.getByText("Ver detalle")).toBeInTheDocument();
    expect(screen.queryByText("Crear producto")).not.toBeInTheDocument();
    expect(screen.queryByText("Eliminar")).not.toBeInTheDocument();
    expect(screen.queryByText("Categorías")).not.toBeInTheDocument();
  });

  it("el administrador puede gestionar productos", () => {
    leerSesion.mockReturnValue({ correo: "admin@sonidovivo.cl", rol: "ADMIN" });
    renderPanel();

    expect(screen.getByText("Crear producto")).toBeInTheDocument();
    expect(screen.getByText("Eliminar")).toBeInTheDocument();
    expect(screen.getByText("Categorías")).toBeInTheDocument();
  });
});
