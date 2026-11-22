
import { useState } from "react";
import { validarContacto } from "../utils/validaciones";
import { crearContacto } from "../services/contactoService";

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
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState("");

  function cambiar(evento) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    setResultado("");
    setErrorEnvio("");
  }

  async function enviar(evento) {
    evento.preventDefault();

    if (enviando) return;

    const datos = {
      nombre: formulario.nombre.trim(),
      correo: formulario.correo.trim(),
      asunto: formulario.asunto.trim(),
      mensaje: formulario.mensaje.trim(),
    };

    const nuevosErrores = validarContacto(datos);

    setErrores(nuevosErrores);
    setResultado("");
    setErrorEnvio("");

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    setEnviando(true);

    try {
      await crearContacto(datos);

      setResultado("Tu mensaje fue enviado correctamente.");
      setFormulario(formularioInicial);
      setErrores({});
    } catch (error) {
      setErrorEnvio(
        error.message ||
          "No se pudo enviar el mensaje. Inténtalo nuevamente."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="container py-5 manuel-formulario">
      <p className="text-uppercase text-info fw-semibold mb-2">
        Escríbenos
      </p>

      <h1>Contacto</h1>

      <form className="row g-3 mt-2" onSubmit={enviar} noValidate>
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="contacto-nombre">
            Nombre
          </label>

          <input
            className="form-control"
            id="contacto-nombre"
            name="nombre"
            value={formulario.nombre}
            onChange={cambiar}
            aria-invalid={Boolean(errores.nombre)}
            disabled={enviando}
          />

          <small className="text-danger">{errores.nombre}</small>
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="contacto-correo">
            Correo
          </label>

          <input
            className="form-control"
            id="contacto-correo"
            name="correo"
            type="email"
            value={formulario.correo}
            onChange={cambiar}
            aria-invalid={Boolean(errores.correo)}
            disabled={enviando}
          />

          <small className="text-danger">{errores.correo}</small>
        </div>

        <div className="col-12">
          <label className="form-label" htmlFor="contacto-asunto">
            Asunto
          </label>

          <input
            className="form-control"
            id="contacto-asunto"
            name="asunto"
            value={formulario.asunto}
            onChange={cambiar}
            aria-invalid={Boolean(errores.asunto)}
            disabled={enviando}
          />

          <small className="text-danger">{errores.asunto}</small>
        </div>

        <div className="col-12">
          <label className="form-label" htmlFor="contacto-mensaje">
            Mensaje
          </label>

          <textarea
            className="form-control"
            id="contacto-mensaje"
            name="mensaje"
            rows={5}
            value={formulario.mensaje}
            onChange={cambiar}
            aria-invalid={Boolean(errores.mensaje)}
            disabled={enviando}
          />

          <small className="text-danger">{errores.mensaje}</small>
        </div>

        <div className="col-12">
          <button
            className="btn btn-info"
            type="submit"
            disabled={enviando}
          >
            {enviando ? "Enviando mensaje..." : "Enviar mensaje"}
          </button>
        </div>

        {resultado && (
          <div className="col-12">
            <p className="text-success mb-0" role="status">
              {resultado}
            </p>
          </div>
        )}

        {errorEnvio && (
          <div className="col-12">
            <p className="text-danger mb-0" role="alert">
              {errorEnvio}
            </p>
          </div>
        )}
      </form>
    </section>
  );
}
