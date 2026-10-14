import { Link, Navigate, useNavigate } from "react-router-dom";
import { cerrarSesion, leerSesion, leerUsuarios } from "../utils/storage";

export default function Perfil() {
  const navigate = useNavigate();
  const sesion = leerSesion();

  if (!sesion) {
    return <Navigate to="/login" replace />;
  }

  const usuario = leerUsuarios().find((item) => item.id === sesion.id);

  if (!usuario) {
    cerrarSesion();
    return <Navigate to="/login" replace />;
  }

  function salir() {
    cerrarSesion();
    navigate("/login");
  }

  return (
    <section className="container py-5">
      <p className="text-uppercase text-info fw-semibold mb-2">Mi cuenta</p>
      <h1>Perfil de usuario</h1>

      <div className="card bg-dark text-light border-secondary mt-4">
        <div className="card-body">
          <p><strong>Nombre:</strong> {usuario.nombre} {usuario.apellido}</p>
          <p><strong>Correo:</strong> {usuario.correo}</p>
          <p><strong>Rol:</strong> {usuario.rol}</p>
          <p><strong>Estado:</strong> {usuario.activo ? "Activo" : "Inactivo"}</p>

          <div className="d-flex flex-wrap gap-2">
            <Link className="btn btn-outline-info" to="/historial">Ver historial de compras</Link>

            {usuario.rol === "administrador" && (
              <Link className="btn btn-info" to="/admin">Ir al panel administrativo</Link>
            )}

            <button className="btn btn-outline-light" type="button" onClick={salir}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
