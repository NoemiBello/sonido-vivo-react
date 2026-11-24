import {
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { login } from "../services/authService";
import { buscarUsuarioPorCorreo } from "../services/usuariosService";
import { guardarSesion } from "../utils/storage";
import { rutaPorRol } from "../utils/roles";

import {
  validarLogin,
} from "../utils/validaciones";

export default function Login() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [
    correo,
    setCorreo,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    errores,
    setErrores,
  ] = useState({});

  const [
    errorCredenciales,
    setErrorCredenciales,
  ] = useState("");

  const [
    enviando,
    setEnviando,
  ] = useState(false);

  async function ingresar(evento) {
    evento.preventDefault();

    const nuevosErrores =
      validarLogin({
        correo,
        password,
      });

    setErrores(
      nuevosErrores,
    );

    setErrorCredenciales(
      "",
    );

    if (
      Object.keys(
        nuevosErrores,
      ).length > 0
    ) {
      return;
    }

    setEnviando(true);

    try {
      const sesion = await login({
        correo: correo.trim(),
        password,
      });

      // Primero se guarda el token: la siguiente petición ya lo necesita.
      guardarSesion(sesion);

      // La ficha es opcional: si no se puede leer, la sesión igual es válida.
      const ficha = await buscarUsuarioPorCorreo(
        sesion.correo,
      ).catch(() => null);

      guardarSesion({
        ...sesion,
        id: ficha?.id,
      });

      navigate(rutaPorRol(sesion.rol));
    } catch (error) {
      setErrorCredenciales(error.message);
    } finally {
      setEnviando(false);
    }
  }

  function cambiarCorreo(
    evento,
  ) {
    setCorreo(
      evento.target.value,
    );

    if (errores.correo) {
      setErrores({
        ...errores,
        correo: "",
      });
    }

    setErrorCredenciales(
      "",
    );
  }

  function cambiarPassword(
    evento,
  ) {
    setPassword(
      evento.target.value,
    );

    if (
      errores.password
    ) {
      setErrores({
        ...errores,
        password: "",
      });
    }

    setErrorCredenciales(
      "",
    );
  }

  return (
    <section className="container py-5 manuel-formulario">
      <p className="text-uppercase text-info fw-semibold mb-2">
        Acceso
      </p>

      <h1>
        Iniciar sesión
      </h1>

      {location.state
        ?.mensaje && (
        <p className="alert alert-success">
          {
            location.state
              .mensaje
          }
        </p>
      )}

      <form
        className="row g-3 mt-2"
        onSubmit={ingresar}
        noValidate
      >
        <div className="col-12">
          <label
            className="form-label"
            htmlFor="login-correo"
          >
            Correo
          </label>

          <input
            className={`form-control ${
              errores.correo
                ? "is-invalid"
                : ""
            }`}
            id="login-correo"
            type="email"
            value={correo}
            onChange={
              cambiarCorreo
            }
            aria-invalid={
              Boolean(
                errores.correo,
              )
            }
            aria-describedby="error-login-correo"
          />

          {errores.correo && (
            <div
              id="error-login-correo"
              className="invalid-feedback"
            >
              {
                errores.correo
              }
            </div>
          )}
        </div>

        <div className="col-12">
          <label
            className="form-label"
            htmlFor="login-password"
          >
            Contraseña
          </label>

          <input
            className={`form-control ${
              errores.password
                ? "is-invalid"
                : ""
            }`}
            id="login-password"
            type="password"
            value={password}
            onChange={
              cambiarPassword
            }
            aria-invalid={
              Boolean(
                errores.password,
              )
            }
            aria-describedby="error-login-password"
          />

          {errores.password && (
            <div
              id="error-login-password"
              className="invalid-feedback"
            >
              {
                errores.password
              }
            </div>
          )}
        </div>

        {errorCredenciales && (
          <div className="col-12">
            <p
              className="alert alert-danger mb-0"
              role="alert"
            >
              {
                errorCredenciales
              }
            </p>
          </div>
        )}

        <div className="col-12 d-flex gap-3 align-items-center">
          <button
            className="btn btn-info"
            type="submit"
            disabled={enviando}
          >
            {enviando
              ? "Ingresando..."
              : "Ingresar"}
          </button>

          <Link
            className="link-info"
            to="/registro"
          >
            Crear cuenta
          </Link>
        </div>
      </form>
    </section>
  );
}