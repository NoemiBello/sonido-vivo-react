const API_URL =
  import.meta.env.VITE_CONTACTO_API_URL ||
  "http://localhost:8089/api/contactos";

export async function crearContacto(datos) {
  const respuesta = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    let mensaje = "No se pudo enviar el mensaje. Inténtalo nuevamente.";

    try {
      const errores = await respuesta.json();

      if (errores.error) {
        mensaje = errores.error;
      } else {
        mensaje = Object.values(errores).join(" ");
      }
    } catch {
      // Mantener el mensaje general si no existe una respuesta JSON.
    }

    throw new Error(mensaje);
  }

  return respuesta.json();
}