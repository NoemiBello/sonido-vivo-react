import { describe, expect, it } from "vitest";
import {
  validarContacto,
  validarRegistro,
} from "../utils/validaciones";

describe("validaciones de formularios", () => {
  it("detecta datos inválidos en contacto", () => {
    const errores = validarContacto({
      nombre: "Ma",
      correo: "correo-invalido",
      asunto: "",
      mensaje: "Hola",
    });

    expect(errores.nombre).toBeDefined();
    expect(errores.correo).toBeDefined();
    expect(errores.asunto).toBeDefined();
    expect(errores.mensaje).toBeDefined();
  });

  it("rechaza un correo repetido en registro", () => {
    const usuarios = [{ correo: "cliente@correo.cl" }];

    const errores = validarRegistro(
      {
        nombre: "Manuel",
        apellido: "Rodríguez",
        correo: "cliente@correo.cl",
        password: "123456",
        confirmarPassword: "123456",
      },
      usuarios,
    );

    expect(errores.correo).toBe(
      "Ya existe un usuario con ese correo.",
    );
  });

  it("rechaza contraseñas diferentes en registro", () => {
    const errores = validarRegistro(
      {
        nombre: "Manuel",
        apellido: "Rodríguez",
        correo: "manuel@correo.cl",
        password: "123456",
        confirmarPassword: "654321",
      },
      [],
    );

    expect(errores.confirmarPassword).toBe(
      "Las contraseñas no coinciden.",
    );
  });
});
