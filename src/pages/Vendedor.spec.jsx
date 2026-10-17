import { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TiendaContext } from "../context/TiendaContext.jsx";
import Login from "./Login";
import {
  AdminCategorias,
  FormularioProducto,
  ListaProductos,
  VendedorLayout,
} from "./Vendedor";

const categoriasIniciales = [
  { id: 1, nombre: "Guitarras", descripcion: "Instrumentos de cuerda." },
  { id: 2, nombre: "Micrófonos", descripcion: "Equipos de voz." },
  { id: 3, nombre: "Teclados", descripcion: "Instrumentos de teclas." },
];

const vendedorPrueba = {
  id: 50,
  nombre: "Vendedor",
  apellido: "Prueba",
  correo: "vendedor@prueba.cl",
  password: "123456",
  rol: "vendedor",
  activo: true,
};

const productosIniciales = [
  {
    id: 1,
    codigo: "GUI001",
    nombre: "Guitarra de prueba",
    categoriaId: 1,
    precio: 100000,
    stock: 5,
    stockCritico: 2,
    descuento: 0,
    descripcion: "Guitarra para probar.",
    imagen: "",
  },
  {
    id: 2,
    codigo: "MIC001",
    nombre: "Micrófono de prueba",
    categoriaId: 2,
    precio: 50000,
    stock: 0,
    stockCritico: 2,
    descuento: 0,
    descripcion: "Micrófono para probar.",
    imagen: "",
  },
];

// Esta preparación permite que los cambios se reflejen en la pantalla.
function renderVendedor(ruta) {
  function ProveedorPrueba({ children }) {
    const [productos, setProductos] = useState(productosIniciales);
    const [categorias, setCategorias] = useState(categoriasIniciales);

    return (
      <TiendaContext.Provider
        value={{ productos, setProductos, categorias, setCategorias }}
      >
        {children}
      </TiendaContext.Provider>
    );
  }

  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <ProveedorPrueba>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/vendedor" element={<VendedorLayout />}>
            <Route index element={<ListaProductos />} />
            <Route path="productos/nuevo" element={<FormularioProducto />} />
            <Route path="productos/:id/editar" element={<FormularioProducto />} />
            <Route path="categorias" element={<AdminCategorias />} />
          </Route>
        </Routes>
      </ProveedorPrueba>
    </MemoryRouter>,
  );
}

describe("Pruebas del panel del vendedor", () => {
  let espia;

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("sesionActiva", "true");
    localStorage.setItem("tipoUsuario", "vendedor");
    localStorage.setItem("correoUsuario", "vendedor@prueba.cl");
  });

  afterEach(() => {
    if (espia) {
      espia.mockRestore();
      espia = undefined;
    }
    localStorage.clear();
  });

  it("permite crear un producto al corregir un código duplicado", async () => {
    const usuario = userEvent.setup();
    renderVendedor("/vendedor/productos/nuevo");

    await usuario.type(screen.getByLabelText("Código"), "GUI001");
    await usuario.type(screen.getByLabelText("Nombre"), "Producto nuevo");
    await usuario.clear(screen.getByLabelText("Precio base ($)"));
    await usuario.type(screen.getByLabelText("Precio base ($)"), "12000");
    await usuario.click(screen.getByRole("button", { name: "Guardar producto" }));

    expect(
      screen.getByText("Ya existe un producto con ese código."),
    ).toBeInTheDocument();

    await usuario.clear(screen.getByLabelText("Código"));
    await usuario.type(screen.getByLabelText("Código"), "NUE001");
    await usuario.click(screen.getByRole("button", { name: "Guardar producto" }));

    expect(await screen.findByText("Producto nuevo")).toBeInTheDocument();
    expect(screen.getByText("Guitarra de prueba")).toBeInTheDocument();
  });

  it("permite editar el stock de un producto existente", async () => {
    const usuario = userEvent.setup();
    renderVendedor("/vendedor/productos/1/editar");

    const stock = screen.getByLabelText("Stock disponible");
    await usuario.clear(stock);
    await usuario.type(stock, "1");
    await usuario.click(screen.getByRole("button", { name: "Guardar producto" }));

    const fila = (await screen.findByText("Guitarra de prueba")).closest("tr");
    expect(within(fila).getByText("1 / 2")).toBeInTheDocument();
    expect(within(fila).getByText("Stock crítico")).toBeInTheDocument();
  });

  it("elimina un producto solo cuando se confirma la acción", async () => {
    const usuario = userEvent.setup();
    espia = vi.spyOn(window, "confirm").mockReturnValue(false);
    renderVendedor("/vendedor");

    const buscar = screen.getByLabelText("Buscar producto");
    await usuario.type(buscar, "GUI001");
    await usuario.click(screen.getByRole("button", { name: "Eliminar" }));

    expect(screen.getByText("Guitarra de prueba")).toBeInTheDocument();

    espia.mockReturnValue(true);
    await usuario.click(screen.getByRole("button", { name: "Eliminar" }));

    expect(espia).toHaveBeenCalledWith("¿Eliminar Guitarra de prueba?");
    expect(screen.getByText("No hay productos para mostrar.")).toBeInTheDocument();

    await usuario.clear(buscar);
    expect(screen.getByText("Micrófono de prueba")).toBeInTheDocument();
  });

  it("permite crear una categoría después de corregir un nombre duplicado", async () => {
    const usuario = userEvent.setup();
    renderVendedor("/vendedor/categorias");

    const nombre = screen.getByLabelText("Nombre");
    await usuario.type(nombre, "   ");
    await usuario.click(screen.getByRole("button", { name: "Crear categoría" }));
    expect(screen.getByText("Escribe un nombre.")).toBeInTheDocument();

    await usuario.clear(nombre);
    await usuario.type(nombre, "Guitarras");
    await usuario.click(screen.getByRole("button", { name: "Crear categoría" }));

    expect(screen.getByText("Ya existe esa categoría.")).toBeInTheDocument();

    await usuario.clear(nombre);
    await usuario.type(nombre, "Baterías");
    await usuario.type(screen.getByLabelText("Descripción"), "Instrumentos de percusión.");
    await usuario.click(screen.getByRole("button", { name: "Crear categoría" }));

    expect(screen.getByText("Baterías")).toBeInTheDocument();
    expect(screen.getByText("Instrumentos de percusión.")).toBeInTheDocument();
  });

  it("permite iniciar y cerrar la sesión de un vendedor", async () => {
    const usuario = userEvent.setup();
    localStorage.clear();
    localStorage.setItem(
      "svReactUsuarios",
      JSON.stringify([vendedorPrueba]),
    );
    renderVendedor("/vendedor");

    expect(
      await screen.findByRole("heading", { name: "Iniciar sesión" }),
    ).toBeInTheDocument();

    await usuario.type(screen.getByLabelText("Correo"), "vendedor@prueba.cl");
    await usuario.type(screen.getByLabelText("Contraseña"), "123456");
    await usuario.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(
      await screen.findByRole("heading", { name: "Panel del vendedor" }),
    ).toBeInTheDocument();

    await usuario.click(screen.getByRole("button", { name: "Cerrar sesión" }));

    expect(
      await screen.findByRole("heading", { name: "Iniciar sesión" }),
    ).toBeInTheDocument();
    expect(localStorage.getItem("sesionActiva")).toBe(null);
  });

  it("elimina categorías sin productos y protege las que tienen productos", async () => {
    const usuario = userEvent.setup();
    espia = vi.spyOn(window, "confirm").mockReturnValue(true);
    renderVendedor("/vendedor/categorias");

    const filaTeclados = screen.getByText("Teclados").closest("tr");
    await usuario.click(within(filaTeclados).getByRole("button", { name: "Editar" }));
    await usuario.click(within(filaTeclados).getByRole("button", { name: "Eliminar" }));

    expect(screen.queryByText("Teclados")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Nombre").value).toBe("");

    const filaGuitarras = screen.getByText("Guitarras").closest("tr");
    await usuario.click(within(filaGuitarras).getByRole("button", { name: "Eliminar" }));

    expect(
      screen.getByText(
        "Reasigna o elimina los productos de esta categoría antes de eliminarla.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Guitarras")).toBeInTheDocument();
  });
});

