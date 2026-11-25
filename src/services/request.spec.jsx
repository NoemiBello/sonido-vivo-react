import { beforeEach, describe, expect, it, vi } from "vitest";
import { request } from "./request";
import { cerrarSesion, leerToken } from "../utils/storage";

vi.mock("../utils/storage", () => ({
  cerrarSesion: vi.fn(),
  leerToken: vi.fn(),
}));

// Devuelve el mensaje del error que lanza request().
async function mensajeDeError() {
  try {
    await request("/ruta");
    return "sin error";
  } catch (error) {
    return error.message;
  }
}

describe("llamadas a la API", () => {
  let fetchSimulado;

  beforeEach(() => {
    vi.clearAllMocks();
    fetchSimulado = vi.spyOn(window, "fetch");
  });

  it("agrega el token Bearer cuando hay sesión", async () => {
    leerToken.mockReturnValue("abc");
    fetchSimulado.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [1],
    });

    expect(await request("/ruta")).toEqual([1]);
    expect(fetchSimulado).toHaveBeenCalledWith("/ruta", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer abc",
      },
    });
  });

  it("devuelve null cuando la respuesta es 204", async () => {
    leerToken.mockReturnValue(null);
    fetchSimulado.mockResolvedValue({ ok: true, status: 204 });

    expect(await request("/ruta", { method: "DELETE" })).toEqual(null);
  });

  it("usa el mensaje de error del backend y mantiene la sesión", async () => {
    leerToken.mockReturnValue("abc");
    fetchSimulado.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: "Credenciales inválidas" }),
    });

    expect(await mensajeDeError()).toEqual("Credenciales inválidas");
    expect(cerrarSesion).not.toHaveBeenCalled();
  });

  it("cierra la sesión cuando la API rechaza el token", async () => {
    leerToken.mockReturnValue("abc");
    fetchSimulado.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => {
        throw new Error("sin cuerpo");
      },
    });

    expect(await mensajeDeError()).toEqual(
      "Tu sesión expiró. Vuelve a iniciar sesión.",
    );
    expect(cerrarSesion).toHaveBeenCalledTimes(1);
  });

  it("avisa la falta de permiso sin cerrar la sesión", async () => {
    leerToken.mockReturnValue("abc");
    fetchSimulado.mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => ({ error: "Forbidden" }),
    });

    expect(await mensajeDeError()).toEqual("No tienes permiso para esta acción.");
    expect(cerrarSesion).not.toHaveBeenCalled();
  });

  it("informa el código en otros errores", async () => {
    leerToken.mockReturnValue(null);
    fetchSimulado.mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({}),
    });

    expect(await mensajeDeError()).toEqual("Solicitud rechazada: 404");
    expect(cerrarSesion).not.toHaveBeenCalled();
  });
});
