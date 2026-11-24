import { Navigate, Outlet } from "react-router-dom";
import { leerSesion } from "../utils/storage";
import { rutaPorRol } from "../utils/roles";

// Ruta padre (guía 17): solo muestra las páginas hijas si hay sesión
// y el rol está dentro de los permitidos.
export default function RutaProtegida({ roles }) {
  const sesion = leerSesion();

  if (!sesion) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(sesion.rol)) {
    return <Navigate to={rutaPorRol(sesion.rol)} replace />;
  }

  return <Outlet />;
}
