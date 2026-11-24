import { beforeEach, describe, expect, it, vi } from "vitest";
import { request } from "./request";
import { leerToken } from "../utils/storage";

vi.mock("../utils/storage", () => ({ leerToken: vi.fn() }));

describe("llamadas a la API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  it("agrega el token Bearer cuando hay sesión", async () => {
    leerToken.mockReturnValue("abc");
    fetch.mockResolvedValue({ ok: true, status: 200, json: async () => [1] });

    expect(await request("/ruta")).toEqual([1]);
    expect(fetch).toHaveBeenCalledWith("/ruta", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer abc",
      },
    });
  });

  it("devuelve null cuando la respuesta es 204", async () => {
    leerToken.mockReturnValue(null);
    fetch.mockResolvedValue({ ok: true, status: 204 });

    expect(await request("/ruta", { method: "DELETE" })).toBeNull();
  });

  it("usa el mensaje de error del backend", async () => {
    leerToken.mockReturnValue(null);
    fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: "El correo ya está registrado" }),
    });

    await expect(request("/ruta")).rejects.toThrow(
      "El correo ya está registrado",
    );
  });

  it("avisa cuando falta permiso y la respuesta no trae cuerpo", async () => {
    leerToken.mockReturnValue("abc");
    fetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => {
        throw new Error("sin cuerpo");
      },
    });

    await expect(request("/ruta")).rejects.toThrow(
      "Tu sesión expiró o no tienes permiso para esta acción.",
    );
  });
});
