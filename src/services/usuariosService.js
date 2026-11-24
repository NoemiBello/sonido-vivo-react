import { leerToken } from "../utils/storage";
import { request } from "./request";

const API_URL =
  import.meta.env.VITE_USUARIOS_API_URL ||
  "http://localhost:8082/api/v1/usuarios";

// Datos personales del usuario: el vínculo con su cuenta es el correo.
// Devuelve null si la cuenta todavía no tiene datos guardados (404).
export async function buscarUsuarioPorCorreo(correo) {
  const respuesta = await fetch(
    `${API_URL}/correo/${encodeURIComponent(correo)}`,
    { headers: { Authorization: `Bearer ${leerToken()}` } },
  );

  if (respuesta.status === 404) {
    return null;
  }

  if (!respuesta.ok) {
    throw new Error("No se pudieron cargar los datos del usuario.");
  }

  return respuesta.json();
}

// El backend exige token con rol ADMIN
export const listarUsuarios = () => request(API_URL);

// Paso 2 del registro: guarda los datos personales
export const crearUsuario = (datos) =>
  request(API_URL, {
    method: "POST",
    body: JSON.stringify(datos),
  });

export const actualizarUsuario = (id, datos) =>
  request(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(datos),
  });
