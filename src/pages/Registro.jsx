import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validarRegistro } from "../utils/validaciones";
import { guardarUsuarios, leerUsuarios } from "../utils/storage";

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

  function cambiar(evento) {
    const { name, value } = evento.target;
    setFormulario({ ...formulario, [name]: value });
  }

  function registrar(evento) {
    evento.preventDefault();

    const usuarios = leerUsuarios();
    const nuevosErrores = validarRegistro(formulario, usuarios);

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    const nuevoUsuario = {
      id: Date.now(),
      nombre: formulario.nombre.trim(),
      apellido: formulario.apellido.trim(),
      correo: formulario.correo.trim().toLowerCase(),
      password: formulario.password,
      rol: "cliente",
      activo: true,
    };

    guardarUsuarios([...usuarios, nuevoUsuario]);

    navigate("/login", {
      state: {
        mensaje: "Cuenta creada. Ya puedes iniciar sesión.",
      },
    });
  }

  return (
    <section className="container py-5 manuel-formulario">
      <p className="text-uppercase text-info fw-semibold mb-2">Nueva cuenta</p>
      <h1>Registro de usuario</h1>

      <form className="row g-3 mt-2" onSubmit={registrar} noValidate>
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="registro-nombre">Nombre</label>
          <input className="form-control" id="registro-nombre" name="nombre" value={formulario.nombre} onChange={cambiar} />
          <small className="text-danger">{errores.nombre}</small>
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="registro-apellido">Apellido</label>
          <input className="form-control" id="registro-apellido" name="apellido" value={formulario.apellido} onChange={cambiar} />
          <small className="text-danger">{errores.apellido}</small>
        </div>

        <div className="col-12">
          <label className="form-label" htmlFor="registro-correo">Correo</label>
          <input className="form-control" id="registro-correo" name="correo" type="email" value={formulario.correo} onChange={cambiar} />
          <small className="text-danger">{errores.correo}</small>
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="registro-password">Contraseña</label>
          <input className="form-control" id="registro-password" name="password" type="password" value={formulario.password} onChange={cambiar} />
          <small className="text-danger">{errores.password}</small>
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="registro-confirmar">Confirmar contraseña</label>
          <input className="form-control" id="registro-confirmar" name="confirmarPassword" type="password" value={formulario.confirmarPassword} onChange={cambiar} />
          <small className="text-danger">{errores.confirmarPassword}</small>
        </div>

        <div className="col-12">
          <button className="btn btn-info" type="submit">Crear cuenta</button>
        </div>
      </form>
    </section>
  );
}
