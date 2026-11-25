// La sesión usa sessionStorage (guía 17): se mantiene al recargar la página
// y se borra al cerrar la pestaña. Nunca se guarda la contraseña.
const CLAVE_TOKEN = "token";
const CLAVE_USUARIO = "usuario";

// El catálogo (services/api.js) lee el token con esta clave: se guarda el mismo
// JWT para que no haya que pegarlo a mano en el panel.
const CLAVE_TOKEN_CATALOGO = "svApiToken";

// Guarda el JWT y los datos que necesita la interfaz.
// "inicio" permite saber cuánto tiempo lleva emitido el token.
export function guardarSesion(sesion) {
  sessionStorage.setItem(CLAVE_TOKEN, sesion.token);
  sessionStorage.setItem(CLAVE_TOKEN_CATALOGO, sesion.token);

  sessionStorage.setItem(
    CLAVE_USUARIO,
    JSON.stringify({
      id: sesion.id ?? null,
      correo: sesion.correo,
      rol: sesion.rol,
      inicio: Date.now(),
    }),
  );
}

export function leerSesion() {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE_USUARIO));
  } catch {
    return null;
  }
}

export function leerToken() {
  return sessionStorage.getItem(CLAVE_TOKEN);
}

export function cerrarSesion() {
  sessionStorage.removeItem(CLAVE_TOKEN);
  sessionStorage.removeItem(CLAVE_TOKEN_CATALOGO);
  sessionStorage.removeItem(CLAVE_USUARIO);
}
