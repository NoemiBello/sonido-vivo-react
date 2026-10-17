import { describe, expect, it } from "vitest";
import { validarProducto } from "./productos";

const categorias = [{ id: 1, nombre: "Guitarras" }];

const producto = {
  id: 2,
  codigo: "NUE001",
  nombre: "Guitarra de prueba",
  descripcion: "Descripción válida.",
  precio: 10000,
  stock: 5,
  stockCritico: 2,
  descuento: 10,
  categoriaId: 1,
};

describe("Validación de productos", () => {
  it("indica el error cuando un campo contiene un dato inválido", () => {
    expect(
      validarProducto({ ...producto, codigo: "AB" }, [], categorias),
    ).toBe("El código debe tener al menos 3 caracteres.");

    expect(
      validarProducto({ ...producto, nombre: " " }, [], categorias),
    ).toBe("El nombre debe tener entre 1 y 100 caracteres.");

    expect(
      validarProducto({ ...producto, descripcion: "A".repeat(501) }, [], categorias),
    ).toBe("La descripción admite hasta 500 caracteres.");

    expect(
      validarProducto({ ...producto, precio: -1 }, [], categorias),
    ).toBe("El precio debe ser un número positivo o cero.");

    expect(
      validarProducto({ ...producto, stock: -1 }, [], categorias),
    ).toBe("El stock y el umbral crítico deben ser enteros positivos o cero.");

    expect(
      validarProducto({ ...producto, descuento: 101 }, [], categorias),
    ).toBe("El descuento debe estar entre 0 y 100.");

    expect(
      validarProducto({ ...producto, categoriaId: 999 }, [], categorias),
    ).toBe("Selecciona una categoría válida.");
  });
});
