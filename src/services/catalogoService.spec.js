import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { cargarCatalogo, guardarProducto, eliminarCategoria } from "./catalogoService";
import { validarAcceso } from "./api";

const respuesta = (datos, status = 200) => ({ ok: status < 400, status, json: async () => datos });
beforeEach(() => { sessionStorage.clear(); vi.stubGlobal("fetch", vi.fn()); });
afterEach(() => vi.unstubAllGlobals());

describe("comunicación con las tres APIs", () => {
  it("combina stock por productoId y asigna cero si todavía no existe inventario", async () => {
    fetch.mockResolvedValueOnce(respuesta([{ id: 2 }, { id: 1 }]))
      .mockResolvedValueOnce(respuesta([{ id: 1, nombre: "Guitarras" }]))
      .mockResolvedValueOnce(respuesta([{ id: 8, productoId: 1, stock: 7, stockCritico: 2 }]));
    const datos = await cargarCatalogo();
    expect(datos.productos[0]).toMatchObject({ id: 2, stock: 0, descripcion: "" });
    expect(datos.productos[1]).toMatchObject({ id: 1, stock: 7, inventarioId: 8 });
  });

  it("guarda producto e inventario por separado enviando el JWT", async () => {
    sessionStorage.setItem("svApiToken", "token-administrador");
    fetch.mockResolvedValueOnce(respuesta({ id: 3, nombre: "Bajo" }, 201))
      .mockResolvedValueOnce(respuesta({}, 404))
      .mockResolvedValueOnce(respuesta({ id: 9, stock: 5, stockCritico: 2 }, 201));
    await guardarProducto({ nombre: "Bajo", stock: 5, stockCritico: 2 });
    expect(fetch.mock.calls[0][1].headers.Authorization).toBe("Bearer token-administrador");
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ nombre: "Bajo" });
    expect(JSON.parse(fetch.mock.calls[2][1].body)).toEqual({ productoId: 3, stock: 5, stockCritico: 2 });
  });

  it("conserva el identificador cuando se guarda el producto pero falla el inventario", async () => {
    fetch.mockResolvedValueOnce(respuesta({ id: 3, nombre: "Bajo" }, 201))
      .mockResolvedValueOnce(respuesta({ mensaje: "Sin conexión" }, 503));
    await expect(guardarProducto({ nombre: "Bajo", stock: 5, stockCritico: 2 }))
      .rejects.toMatchObject({ producto: { id: 3 }, message: expect.stringContaining("El producto se guardó") });
  });

  it("recupera un inventario existente al reintentar, sin duplicarlo", async () => {
    fetch.mockResolvedValueOnce(respuesta({ id: 3 }))
      .mockResolvedValueOnce(respuesta({ id: 9, productoId: 3 }))
      .mockResolvedValueOnce(respuesta({ id: 9, stock: 7, stockCritico: 2 }));
    await guardarProducto({ id: 3, stock: 7, stockCritico: 2 });
    expect(fetch.mock.calls[2][0]).toBe("http://localhost:8086/api/v1/inventario/9");
    expect(fetch.mock.calls[2][1].method).toBe("PUT");
  });

  it("muestra el motivo de rechazo de una categoría relacionada", async () => {
    fetch.mockResolvedValueOnce(respuesta({ mensaje: "La categoría tiene productos" }, 409));
    await expect(eliminarCategoria(1)).rejects.toMatchObject({ status: 409, message: "La categoría tiene productos" });
  });

  it("verifica el acceso administrativo en el backend, sin guardar el token antes", async () => {
    fetch.mockResolvedValueOnce(respuesta({ correo: "admin@example.com", rol: "ADMIN" }));
    await expect(validarAcceso("jwt-candidato")).resolves.toMatchObject({ rol: "ADMIN" });
    expect(fetch.mock.calls[0][0]).toBe("http://localhost:8084/api/v1/productos/acceso");
    expect(fetch.mock.calls[0][1].headers.Authorization).toBe("Bearer jwt-candidato");
    expect(sessionStorage.getItem("svApiToken")).toBeNull();
  });

  it("retira un token expirado cuando el backend devuelve 401", async () => {
    sessionStorage.setItem("svApiToken", "expirado");
    fetch.mockResolvedValueOnce(respuesta({}, 401));
    await expect(validarAcceso()).rejects.toMatchObject({ status: 401 });
    expect(sessionStorage.getItem("svApiToken")).toBeNull();
  });
});
