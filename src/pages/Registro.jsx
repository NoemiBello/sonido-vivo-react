import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validarRegistro } from "../utils/validaciones";
import { guardarSesion } from "../utils/storage";
import { registrar as registrarCuenta } from "../services/authService";
import { crearUsuario } from "../services/usuariosService";

const formularioInicial = {
  nombre: "",
  apellido: "",
  correo: "",
  password: "",
  confirmarPassword: "",
};

export default function Registro() {
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState(formularioInicial);
  const [errores, setErrores] = useState({});
  const [errorEnvio, setErrorEnvio] = useState("");
  const [enviando, setEnviando] = useState(false);

  function cambiar(evento) {
    const { name, value } = evento.target;
    setFormulario({ ...formulario, [name]: value });
  }

  async function registrar(evento) {
    evento.preventDefault();

    const nuevosErrores = validarRegistro(formulario);

    setErrores(nuevosErrores);
    setErrorEnvio("");

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    setEnviando(true);

    try {
      // Paso 1: authservice crea la cuenta y devuelve el token.
      const sesion = await registrarCuenta({
        correo: formulario.correo.trim().toLowerCase(),
        password: formulario.password,
      });

      guardarSesion(sesion);

      // Paso 2: usuariosservice guarda los datos personales con ese token.
      // Si falla, la cuenta ya existe: los datos se completan en el perfil.
      const ficha = await crearUsuario({
        correo: sesion.correo,
        nombre: formulario.nombre.trim(),
        apellido: formulario.apellido.trim(),
      }).catch(() => null);

      guardarSesion({ ...sesion, id: ficha?.id });

      navigate("/perfil");
    } catch (error) {
      setErrorEnvio(error.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="container py-5 manuel-formulario">
      <p className="text-uppercase text-info fw-semibold mb-2">Nueva cuenta</p>
      <h1>Registro de usuario</h1>

      <form className="row g-3 mt-2" onSubmit={registrar} noValidate>
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="registro-nombre">
            Nombre
          </label>
          <input
            className="form-control"
            id="registro-nombre"
            name="nombre"
            maxLength={80}
            value={formulario.nombre}
            onChange={cambiar}
          />
          <small className="text-danger">{errores.nombre}</small>
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="registro-apellido">
            Apellido
          </label>
          <input
            className="form-control"
            id="registro-apellido"
            name="apellido"
            maxLength={80}
            value={formulario.apellido}
            onChange={cambiar}
          />
          <small className="text-danger">{errores.apellido}</small>
        </div>

        <div className="col-12">
          <label className="form-label" htmlFor="registro-correo">
            Correo
          </label>
          <input
            className="form-control"
            id="registro-correo"
            name="correo"
            maxLength={100}
            type="email"
            value={formulario.correo}
            onChange={cambiar}
          />
          <small className="text-danger">{errores.correo}</small>
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="registro-password">
            Contraseña
          </label>
          <input
            className="form-control"
            id="registro-password"
            name="password"
            type="password"
            value={formulario.password}
            onChange={cambiar}
          />
          <small className="text-danger">{errores.password}</small>
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="registro-confirmar">
            Confirmar contraseña
          </label>
          <input
            className="form-control"
            id="registro-confirmar"
            name="confirmarPassword"
            type="password"
            value={formulario.confirmarPassword}
            onChange={cambiar}
          />
          <small className="text-danger">{errores.confirmarPassword}</small>
        </div>

        {errorEnvio && (
          <div className="col-12">
            <p className="alert alert-danger mb-0" role="alert">{errorEnvio}</p>
          </div>
        )}

        <div className="col-12">
          <button className="btn btn-info" type="submit" disabled={enviando}>
            {enviando ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </div>
      </form>
    </section>
  );
}
