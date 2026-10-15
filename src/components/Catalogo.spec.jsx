import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Catalogo from "./Catalogo";
import { TiendaContext } from "../context/TiendaContext.jsx";

const categorias = [
  { id: 1, nombre: "Guitarras" },
  { id: 2, nombre: "Micrófonos" },
];

const productos = [
  {
    id: 1,
    codigo: "GUI001",
    nombre: "Guitarra de prueba",
    categoriaId: 1,
    precio: 100000,
    stock: 5,
    stockCritico: 2,
    descuento: 0,
    imagen: "/img/guitarra.jpg",
    descripcion: "Guitarra para probar el catálogo.",
  },
  {
    id: 2,
    codigo: "MIC001",
    nombre: "Micrófono de prueba",
    categoriaId: 2,
    precio: 50000,
    stock: 1,
    stockCritico: 2,
    descuento: 20,
    imagen: "/img/microfono.jpg",
    descripcion: "Micrófono para probar ofertas.",
  },
];

function renderCatalogo(componente) {
  function ProveedorPrueba({ children }) {
    const [listaProductos] = useState(productos);
    const [listaCategorias] = useState(categorias);

    return (
      <TiendaContext.Provider
        value={{
          productos: listaProductos,
          categorias: listaCategorias,
        }}
      >
        {children}
      </TiendaContext.Provider>
    );
  }

  return render(
    <MemoryRouter>
      <ProveedorPrueba>{componente}</ProveedorPrueba>
    </MemoryRouter>,
  );
}

describe("Pruebas del catálogo", () => {
  it("busca productos por nombre o código", async () => {
    const user = userEvent.setup();
    renderCatalogo(<Catalogo />);

    await user.type(
      screen.getByRole("searchbox", { name: "Buscar" }),
      "MIC001",
    );

    expect(
      screen.getByRole("heading", { name: "Micrófono de prueba" }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", { name: "Guitarra de prueba" }),
    ).not.toBeInTheDocument();
  });

  it("filtra los productos por categoría", async () => {
    const user = userEvent.setup();
    renderCatalogo(<Catalogo />);

    await user.selectOptions(screen.getByLabelText("Categoría"), "2");

    expect(
      screen.getByRole("heading", { name: "Micrófono de prueba" }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", { name: "Guitarra de prueba" }),
    ).not.toBeInTheDocument();
  });

  it("en la página de ofertas muestra solo productos con descuento", () => {
    renderCatalogo(<Catalogo ofertas />);

    expect(
      screen.getByRole("heading", { name: "Micrófono de prueba" }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", { name: "Guitarra de prueba" }),
    ).not.toBeInTheDocument();
  });
});