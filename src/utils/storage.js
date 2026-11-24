import { pedidosIniciales } from "../data/pedidos";

const CLAVE_PEDIDOS = "svReactPedidos";

// La sesión usa sessionStorage (guía 17): se mantiene al recargar la página
// y se borra al cerrar la pestaña. Nunca se guarda la contraseña.
const CLAVE_TOKEN = "token";
const CLAVE_USUARIO = "usuario";

function leerLista(clave, inicial) {
  try {
    const guardado = JSON.parse(localStorage.getItem(clave));
    return Array.isArray(guardado) ? guardado : inicial;
  } catch {
    return inicial;
  }
}

export function leerPedidos() {
  return leerLista(CLAVE_PEDIDOS, pedidosIniciales);
}

export function guardarPedidos(pedidos) {
  localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(pedidos));
}

// Guarda el JWT y los datos que necesita la interfaz.
// "inicio" permite saber cuánto tiempo lleva emitido el token.
export function guardarSesion(sesion) {
  sessionStorage.setItem(CLAVE_TOKEN, sesion.token);

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
  sessionStorage.removeItem(CLAVE_USUARIO);
}
