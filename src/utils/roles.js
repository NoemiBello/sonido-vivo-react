// Roles que entrega el backend dentro del JWT (contrato con authservice).
const NOMBRES = {
  ADMIN: "Administrador",
  VENDEDOR: "Vendedor",
  USER: "Cliente",
};

export function nombreRol(rol) {
  return NOMBRES[rol] || rol;
}

// Página principal de cada rol después de iniciar sesión.
export function rutaPorRol(rol) {
  if (rol === "ADMIN") {
    return "/admin";
  }

  if (rol === "VENDEDOR") {
    return "/vendedor";
  }

  return "/perfil";
}
