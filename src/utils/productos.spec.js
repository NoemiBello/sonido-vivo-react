import { describe, expect, it } from "vitest";
import {
  esCritico,
  precioFinal,
  validarProducto,
} from "./productos";

const categorias = [{ id: 1, nombre: "Guitarras" }];

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
    descripcion: "Guitarra para probar.",
  },
];

describe("Pruebas de las utilidades de productos", () => {
  it("mantiene el precio cuando no tiene descuento", () => {
    expect(precioFinal({ precio: 10000, descuento: 0 })).toBe(10000);
  });

  it("calcula el precio final con descuento", () => {
    expect(precioFinal({ precio: 10000, descuento: 15 })).toBe(8500);
  });

  it("identifica como crítico el stock igual al mínimo", () => {
    expect(esCritico({ stock: 2, stockCritico: 2 })).toBe(true);
  });

  it("acepta un producto válido", () => {
    const producto = {
      id: 2,
      codigo: "TEST02",
      nombre: "Producto de prueba",
      descripcion: "Descripción válida.",
      precio: 10000,
      stock: 5,
      stockCritico: 2,
      descuento: 10,
      categoriaId: 1,
    };

    expect(validarProducto(producto, productos, categorias)).toBe("");
  });

  it("rechaza un código duplicado aunque cambien las mayúsculas", () => {
    const producto = {
      id: 2,
      codigo: "gui001",
      nombre: "Otra guitarra",
      descripcion: "Descripción válida.",
      precio: 10000,
      stock: 5,
      stockCritico: 2,
      descuento: 0,
      categoriaId: 1,
    };

    expect(validarProducto(producto, productos, categorias)).toBe(
      "Ya existe un producto con ese código.",
    );
  });
});