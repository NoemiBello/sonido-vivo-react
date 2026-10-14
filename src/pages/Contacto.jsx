import { useState } from "react";
import { validarContacto } from "../utils/validaciones";

const formularioInicial = {
  nombre: "",
  correo: "",
  asunto: "",
  mensaje: "",
};

export default function Contacto() {
  const [formulario, setFormulario] = useState(formularioInicial);
  const [errores, setErrores] = useState({});
  const [resultado, setResultado] = useState("");

  function cambiar(evento) {
    const { name, value } = evento.target;
    setFormulario({ ...formulario, [name]: value });
  }

  function enviar(evento) {
    evento.preventDefault();

    const nuevosErrores = validarContacto(formulario);
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      setResultado("");
      return;
    }

    setResultado("Mensaje validado correctamente.");
    setFormulario(formularioInicial);
  }

  return (
    <section className="container py-5 manuel-formulario">
      <p className="text-uppercase text-info fw-semibold mb-2">Escríbenos</p>
      <h1>Contacto</h1>

      <form className="row g-3 mt-2" onSubmit={enviar} noValidate>
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="contacto-nombre">Nombre</label>
          <input className="form-control" id="contacto-nombre" name="nombre" value={formulario.nombre} onChange={cambiar} aria-invalid={Boolean(errores.nombre)} />
          <small className="text-danger">{errores.nombre}</small>
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="contacto-correo">Correo</label>
          <input className="form-control" id="contacto-correo" name="correo" type="email" value={formulario.correo} onChange={cambiar} aria-invalid={Boolean(errores.correo)} />
          <small className="text-danger">{errores.correo}</small>
        </div>

        <div className="col-12">
          <label className="form-label" htmlFor="contacto-asunto">Asunto</label>
          <input className="form-control" id="contacto-asunto" name="asunto" value={formulario.asunto} onChange={cambiar} aria-invalid={Boolean(errores.asunto)} />
          <small className="text-danger">{errores.asunto}</small>
        </div>

        <div className="col-12">
          <label className="form-label" htmlFor="contacto-mensaje">Mensaje</label>
          <textarea className="form-control" id="contacto-mensaje" name="mensaje" rows={5} value={formulario.mensaje} onChange={cambiar} aria-invalid={Boolean(errores.mensaje)} />
          <small className="text-danger">{errores.mensaje}</small>
        </div>

        <div className="col-12">
          <button className="btn btn-info" type="submit">Validar mensaje</button>
        </div>

        <p className="text-success" role="status">{resultado}</p>
      </form>
    </section>
  );
}
