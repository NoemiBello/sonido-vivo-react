import { request } from "./request";

const API_URL =
  import.meta.env.VITE_SERVICIOS_TECNICOS_API_URL ||
  "http://localhost:8083/api/v1/servicios-tecnicos";

// Formulario público de la página Servicios
export const crearSolicitud = (datos) =>
  request(API_URL, {
    method: "POST",
    body: JSON.stringify(datos),
  });

// El cliente consulta el estado de sus solicitudes
export const listarSolicitudesPorCorreo = (correo) =>
  request(`${API_URL}/correo/${encodeURIComponent(correo)}`);

// Gestión: el backend exige token con rol ADMIN
export const listarSolicitudes = () => request(API_URL);

export const cambiarEstadoSolicitud = (id, estado) =>
  request(`${API_URL}/${id}/estado`, {
    method: "PUT",
    body: JSON.stringify({ estado }),
  });

export const eliminarSolicitud = (id) =>
  request(`${API_URL}/${id}`, {
    method: "DELETE",
  });
