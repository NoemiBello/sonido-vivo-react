const servidores = {
  productos: import.meta.env.VITE_PRODUCTOS_API_URL || "http://localhost:8084/api/productos",
  categorias: import.meta.env.VITE_CATEGORIAS_API_URL || "http://localhost:8085/api/categorias",
  inventario: import.meta.env.VITE_INVENTARIO_API_URL || "http://localhost:8086/api/inventario",
};

export const obtenerToken = () => sessionStorage.getItem("svApiToken");
export const guardarToken = (token) => sessionStorage.setItem("svApiToken", token);
export function cerrarAcceso() {
  sessionStorage.removeItem("svApiToken");
  window.dispatchEvent(new Event("sv-api-sesion"));
}

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.status = status;
  }
}

export async function solicitar(servicio, ruta = "", { method = "GET", body, signal, token = obtenerToken() } = {}) {
  let respuesta;
  try {
    respuesta = await fetch(`${servidores[servicio]}${ruta}`, {
      method,
      signal,
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ApiError("No se pudo conectar con el servidor. Intenta nuevamente.");
  }
  if (!respuesta.ok) {
    const datos = await respuesta.json().catch(() => ({}));
    if (respuesta.status === 401) cerrarAcceso();
    const mensaje = respuesta.status === 401 ? "El token no es válido o expiró. Vuelve a iniciar el acceso."
      : respuesta.status === 403 ? "Necesitas un token con rol ADMIN para administrar el catálogo."
        : [datos.mensaje, ...Object.values(datos.errores || {})].filter(Boolean).join(" ") || "No se pudo completar la solicitud.";
    throw new ApiError(mensaje, respuesta.status);
  }
  return respuesta.status === 204 ? null : respuesta.json();
}

// El servidor verifica la firma, el emisor, la expiración y el rol del token.
export const validarAcceso = (token = obtenerToken()) => solicitar("productos", "/acceso", { token });
