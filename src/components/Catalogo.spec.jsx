import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
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
    descripcion: "Guitarra para probar.",
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
    descripcion: "Micrófono en oferta.",
  },
  {
    id: 3,
    codigo: "GUI002",
    nombre: "Guitarra agotada",
    categoriaId: 1,
    precio: 80000,
    stock: 0,
    stockCritico: 2,
    descuento: 0,
    imagen: "",
    descripcion: "Guitarra sin stock.",
  },
];

// El catálogo necesita las rutas y los datos compartidos de la tienda.
function renderCatalogo(props = {}) {
  return render(
    <MemoryRouter>
      <TiendaContext.Provider value={{ productos, categorias }}>
        <Catalogo {...props} />
      </TiendaContext.Provider>
    </MemoryRouter>,
  );
}

describe("Pruebas del catálogo", () => {
  it("busca por código y avisa cuando no encuentra productos", async () => {
    const usuario = userEvent.setup();
    renderCatalogo();

    const buscar = screen.getByRole("searchbox", { name: "Buscar" });
    await usuario.type(buscar, "MIC001");

    expect(screen.getByText("Micrófono de prueba")).toBeInTheDocument();
    expect(screen.queryByText("Guitarra de prueba")).not.toBeInTheDocument();

    await usuario.clear(buscar);
    await usuario.type(buscar, "producto inexistente");

    expect(
      screen.getByText("No hay productos que coincidan con tu búsqueda."),
    ).toBeInTheDocument();
  });

  it("permite seleccionar y ordenar los productos que se muestran", async () => {
    const usuario = userEvent.setup();
    renderCatalogo();

    await usuario.selectOptions(screen.getByLabelText("Categoría"), "1");
    await usuario.click(screen.getByLabelText("Solo disponibles"));

    expect(screen.getByText("Guitarra de prueba")).toBeInTheDocument();
    expect(screen.queryByText("Guitarra agotada")).not.toBeInTheDocument();
    expect(screen.queryByText("Micrófono de prueba")).not.toBeInTheDocument();

    await usuario.click(screen.getByLabelText("Solo disponibles"));
    await usuario.selectOptions(screen.getByLabelText("Categoría"), "");
    await usuario.selectOptions(screen.getByLabelText("Ordenar"), "menor");

    const ordenMenor = screen.getAllByRole("heading", { level: 2 });
    expect(ordenMenor[0].textContent).toBe("Micrófono de prueba");

    await usuario.selectOptions(screen.getByLabelText("Ordenar"), "mayor");

    const ordenMayor = screen.getAllByRole("heading", { level: 2 });
    expect(ordenMayor[0].textContent).toBe("Guitarra de prueba");
  });

  it("añade al carrito una oferta con el precio descontado", async () => {
    const usuario = userEvent.setup();
    const agregarAlCarrito = vi.fn();
    renderCatalogo({ ofertas: true, agregarAlCarrito });

    expect(screen.getByRole("heading", { name: "Ofertas" })).toBeInTheDocument();
    expect(screen.queryByText("Guitarra de prueba")).not.toBeInTheDocument();

    await usuario.click(
      screen.getByRole("button", { name: "Añadir al carrito" }),
    );

    expect(agregarAlCarrito).toHaveBeenCalledWith({
      ...productos[1],
      precio: 40000,
    });
  });
});
