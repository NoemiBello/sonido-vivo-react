import { cerrarSesion, leerToken } from "../utils/storage";

// Función común para llamar a las API (guía 17): agrega el token si existe,
// convierte la respuesta y transforma los errores del backend en Error.
export async function request(url, opciones = {}) {
  const token = leerToken();
  const headers = { "Content-Type": "application/json", ...opciones.headers };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const respuesta = await fetch(url, { ...opciones, headers });

  if (!respuesta.ok) {
    throw new Error(await leerMensaje(respuesta));
  }

  return respuesta.status === 204 ? null : respuesta.json();
}

// El backend responde { "error": "mensaje" }. Los 401 y 403 de Spring Security
// llegan sin ese cuerpo: el token ya no sirve, así que se cierra la sesión.
async function leerMensaje(respuesta) {
  try {
    const datos = await respuesta.json();

    if (datos.error) {
      return datos.error;
    }
  } catch {
    // La respuesta no traía JSON: se usa uno de los mensajes siguientes.
  }

  if (respuesta.status === 401 || respuesta.status === 403) {
    cerrarSesion();
    return "Tu sesión expiró o no tienes permiso para esta acción.";
  }

  return `Solicitud rechazada: ${respuesta.status}`;
}
