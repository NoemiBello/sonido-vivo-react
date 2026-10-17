import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { guardarSesion, leerUsuarios } from "../utils/storage";

const servicioUsuariosReal = {
  guardarSesion,
  leerUsuarios,
};

export default function Login({
  servicioUsuarios = servicioUsuariosReal,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function ingresar(evento) {
    evento.preventDefault();

    const usuario = servicioUsuarios
      .leerUsuarios()
      .find(
        (item) =>
          item.correo.toLowerCase() === correo.trim().toLowerCase() &&
          item.password === password &&
          item.activo,
      );

    if (!usuario) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    servicioUsuarios.guardarSesion(usuario);

    if (usuario.rol === "administrador") {
      navigate("/admin");
      return;
    }

    if (usuario.rol === "vendedor") {
      navigate("/vendedor");
      return;
    }

    navigate("/perfil");
  }

  return (
    <section className="container py-5 manuel-formulario">
      <p className="text-uppercase text-info fw-semibold mb-2">Acceso</p>
      <h1>Iniciar sesión</h1>

      {location.state?.mensaje && (
        <p className="alert alert-success">{location.state.mensaje}</p>
      )}

      <p className="text-secondary">
        Inicio de sesión simulado para esta etapa frontend.
      </p>

      <form className="row g-3 mt-2" onSubmit={ingresar}>
        <div className="col-12">
          <label className="form-label" htmlFor="login-correo">
            Correo
          </label>
          <input
            className="form-control"
            id="login-correo"
            type="email"
            value={correo}
            onChange={(evento) => setCorreo(evento.target.value)}
            required
          />
        </div>

        <div className="col-12">
          <label className="form-label" htmlFor="login-password">
            Contraseña
          </label>
          <input
            className="form-control"
            id="login-password"
            type="password"
            value={password}
            onChange={(evento) => setPassword(evento.target.value)}
            required
          />
        </div>

        <p className="text-danger" role="alert">
          {error}
        </p>

        <div className="col-12 d-flex gap-3 align-items-center">
          <button className="btn btn-info" type="submit">
            Ingresar
          </button>
          <Link className="link-info" to="/registro">
            Crear cuenta
          </Link>
        </div>
      </form>
    </section>
  );
}
