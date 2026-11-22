
const API_URL =
  import.meta.env.VITE_PUBLICACIONES_API_URL ||
  "http://localhost:8088/api/publicaciones";

// Obtener todas las publicaciones
export async function listarPublicaciones() {
  const respuesta = await fetch(API_URL);

  if (!respuesta.ok) {
    throw new Error("No se pudieron cargar las publicaciones.");
  }

  return respuesta.json();
}

// Obtener una publicación por su ID
export async function obtenerPublicacionPorId(id) {
  const respuesta = await fetch(`${API_URL}/${encodeURIComponent(id)}`);

  if (respuesta.status === 404) {
    return null;
  }

  if (!respuesta.ok) {
    throw new Error("No se pudo cargar la publicación.");
  }

  return respuesta.json();
}

// Crear publicación: requiere token ADMIN
export async function crearPublicacion(datos, token) {
  const respuesta = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo crear la publicación.");
  }

  return respuesta.json();
}

// Actualizar publicación: requiere token ADMIN
export async function actualizarPublicacion(id, datos, token) {
  const respuesta = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo actualizar la publicación.");
  }

  return respuesta.json();
}

// Eliminar publicación: requiere token ADMIN
export async function eliminarPublicacion(id, token) {
  const respuesta = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo eliminar la publicación.");
  }
}
