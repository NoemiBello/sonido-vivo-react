import { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { TiendaContext } from "../context/TiendaContext.jsx";

import {
  AdminCategorias,
  FormularioProducto,
  ListaProductos,
} from "./Vendedor";

const categorias = [
  {
    id: 1,
    nombre: "Guitarras",
    descripcion: "Instrumentos de cuerda.",
  },
];

function renderVendedor(componente, productosIniciales = []) {
  function ProveedorPrueba({ children }) {
    const [productos, setProductos] = useState(productosIniciales);

    const [listaCategorias, setListaCategorias] =
      useState(categorias);

    return (
      <TiendaContext.Provider
        value={{
          productos,
          setProductos,
          categorias: listaCategorias,
          setCategorias: setListaCategorias,
        }}
      >
        {children}
      </TiendaContext.Provider>
    );
  }

  return render(
    <ProveedorPrueba>
      <MemoryRouter initialEntries={["/vendedor"]}>
        {componente}
      </MemoryRouter>
    </ProveedorPrueba>,
  );
}

describe("Pruebas del panel del vendedor", () => {
  it("permite crear un producto, editar su stock y eliminarlo", async () => {
    const user = userEvent.setup();

    renderVendedor(
      <Routes>
        <Route
          path="/vendedor"
          element={<ListaProductos />}
        />

        <Route
          path="/vendedor/productos/nuevo"
          element={<FormularioProducto />}
        />

        <Route
          path="/vendedor/productos/:id/editar"
          element={<FormularioProducto />}
        />
      </Routes>,
    );

    await user.click(
      screen.getByRole("link", {
        name: "Crear producto",
      }),
    );

    await user.type(
      screen.getByLabelText("Código"),
      "NUE001",
    );

    await user.type(
      screen.getByLabelText("Nombre"),
      "Producto nuevo",
    );

    await user.selectOptions(
      screen.getByLabelText("Categoría"),
      "1",
    );

    await user.clear(
      screen.getByLabelText("Precio base ($)"),
    );

    await user.type(
      screen.getByLabelText("Precio base ($)"),
      "12000",
    );

    await user.clear(
      screen.getByLabelText("Stock disponible"),
    );

    await user.type(
      screen.getByLabelText("Stock disponible"),
      "5",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Guardar producto",
      }),
    );

    expect(
      await screen.findByText("Producto nuevo"),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("link", {
        name: "Editar / stock",
      }),
    );

    const campoStock =
      screen.getByLabelText("Stock disponible");

    await user.clear(campoStock);

    await user.type(
      campoStock,
      "1",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Guardar producto",
      }),
    );

    expect(
      await screen.findByText("1 / 2"),
    ).toBeInTheDocument();

    vi.spyOn(
      window,
      "confirm",
    ).mockReturnValue(true);

    await user.click(
      screen.getByRole("button", {
        name: "Eliminar",
      }),
    );

    expect(
      await screen.findByText(
        "No hay productos para mostrar.",
      ),
    ).toBeInTheDocument();
  });

  it("permite crear, editar y borrar categorías, y protege las asociadas", async () => {
    const user = userEvent.setup();

    const producto = {
      id: 1,
      codigo: "GUI001",
      nombre: "Guitarra asociada",
      categoriaId: 1,
      precio: 100000,
      stock: 2,
      stockCritico: 1,
      descuento: 0,
      descripcion: "Producto de prueba.",
    };

    renderVendedor(
      <AdminCategorias />,
      [producto],
    );

    await user.type(
      screen.getByLabelText("Nombre"),
      "Micrófonos",
    );

    await user.type(
      screen.getByLabelText("Descripción"),
      "Categoría creada en la prueba.",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Crear categoría",
      }),
    );

    const filaMicrofonos =
      screen
        .getByText("Micrófonos")
        .closest("tr");

    await user.click(
      within(filaMicrofonos).getByRole(
        "button",
        {
          name: "Editar",
        },
      ),
    );

    const campoNombre =
      screen.getByLabelText("Nombre");

    await user.clear(campoNombre);

    await user.type(
      campoNombre,
      "Audio",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Guardar cambios",
      }),
    );

    const filaAudio =
      screen
        .getByText("Audio")
        .closest("tr");

    vi.spyOn(
      window,
      "confirm",
    ).mockReturnValue(true);

    await user.click(
      within(filaAudio).getByRole(
        "button",
        {
          name: "Eliminar",
        },
      ),
    );

    expect(
      screen.queryByText("Audio"),
    ).not.toBeInTheDocument();

    const filaCategoria =
      screen
        .getByText("Guitarras")
        .closest("tr");

    await user.click(
      within(filaCategoria).getByRole(
        "button",
        {
          name: "Eliminar",
        },
      ),
    );

    expect(
      screen.getByText(
        "Reasigna o elimina los productos de esta categoría antes de eliminarla.",
      ),
    ).toBeInTheDocument();
  });
});