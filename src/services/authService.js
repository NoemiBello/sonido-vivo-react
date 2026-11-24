import { leerToken } from "../utils/storage";
import { request } from "./request";

const API_URL =
  import.meta.env.VITE_AUTH_API_URL || "http://localhost:8081/api/v1/auth";

// Devuelve { token, correo, rol }
export const login = (credenciales) =>
  request(`${API_URL}/login`, {
    method: "POST",
    body: JSON.stringify(credenciales),
  });

// Paso 1 del registro: crea la cuenta con rol USER y devuelve { token, correo, rol }
export const registrar = (credenciales) =>
  request(`${API_URL}/registro`, {
    method: "POST",
    body: JSON.stringify(credenciales),
  });

// Cambia un token vigente por uno nuevo
export const renovarToken = () =>
  request(`${API_URL}/refresh`, {
    method: "POST",
    body: JSON.stringify({ token: leerToken() }),
  });

// Administración de cuentas: el backend exige token con rol ADMIN
export const listarCuentas = () => request(`${API_URL}/usuarios`);

export const crearCuenta = (datos) =>
  request(`${API_URL}/usuarios`, {
    method: "POST",
    body: JSON.stringify(datos),
  });

export const actualizarCuenta = (id, datos) =>
  request(`${API_URL}/usuarios/${id}`, {
    method: "PUT",
    body: JSON.stringify(datos),
  });

export const desactivarCuenta = (id) =>
  request(`${API_URL}/usuarios/${id}`, {
    method: "DELETE",
  });
