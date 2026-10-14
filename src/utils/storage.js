import { usuariosIniciales } from "../data/usuarios";
import { pedidosIniciales } from "../data/pedidos";

const CLAVE_USUARIOS = "svReactUsuarios";
const CLAVE_PEDIDOS = "svReactPedidos";
const CLAVE_SESION = "svReactSesion";

function leerLista(clave, inicial) {
  try {
    const guardado = JSON.parse(localStorage.getItem(clave));
    return Array.isArray(guardado) ? guardado : inicial;
  } catch {
    return inicial;
  }
}

export function leerUsuarios() {
  return leerLista(CLAVE_USUARIOS, usuariosIniciales);
}

export function guardarUsuarios(usuarios) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

export function leerPedidos() {
  return leerLista(CLAVE_PEDIDOS, pedidosIniciales);
}

export function guardarPedidos(pedidos) {
  localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(pedidos));
}

export function guardarSesion(usuario) {
  const sesion = {
    id: usuario.id,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    correo: usuario.correo,
    rol: usuario.rol,
  };

  localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));

  // Mantiene compatibilidad con el panel vendedor existente.
  localStorage.setItem("sesionActiva", "true");
  localStorage.setItem("tipoUsuario", usuario.rol);
  localStorage.setItem("correoUsuario", usuario.correo);
}

export function leerSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION));
  } catch {
    return null;
  }
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
  localStorage.removeItem("sesionActiva");
  localStorage.removeItem("tipoUsuario");
  localStorage.removeItem("correoUsuario");
}
