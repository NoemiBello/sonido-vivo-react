import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { cerrarSesion, leerSesion } from "../../utils/storage";

export default function AdminLayout() {
  const navigate = useNavigate();
  const sesion = leerSesion();

  if (!sesion || sesion.rol !== "administrador") {
    return <Navigate to="/login" replace />;
  }

  function salir() {
    cerrarSesion();
    navigate("/login");
  }

  return (
    <section className="container py-4">
      <p className="text-uppercase text-info fw-semibold mb-1">Administración</p>
      <h1>Panel administrativo</h1>
      <p>{sesion.correo}</p>

      <nav className="nav nav-pills gap-2 my-4">
        <NavLink className="nav-link" end to="/admin">Dashboard</NavLink>
        <NavLink className="nav-link" to="/admin/usuarios">Usuarios</NavLink>
        <NavLink className="nav-link" to="/admin/pedidos">Pedidos</NavLink>
        <NavLink className="nav-link" to="/admin/reportes">Reportes</NavLink>
        <NavLink className="nav-link" to="/perfil">Perfil</NavLink>
        <button className="btn btn-outline-light" type="button" onClick={salir}>
          Cerrar sesión
        </button>
      </nav>

      <Outlet />
    </section>
  );
}
