import { useState } from "react";
import { validarServicio } from "../utils/validaciones";
import { crearSolicitud } from "../services/serviciosTecnicosService";

const formularioInicial = {
  nombre: "",
  correo: "",
  telefono: "",
  instrumento: "",
  descripcion: "",
  aceptaCondiciones: false,
};

function Servicios() {
  const [formulario, setFormulario] = useState(formularioInicial);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [errorEnvio, setErrorEnvio] = useState("");
  const [enviando, setEnviando] = useState(false);

  function cambiar(evento) {
    const { name, value, type, checked } = evento.target;
    setFormulario({
      ...formulario,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function enviar(evento) {
    evento.preventDefault();

    const nuevosErrores = validarServicio(formulario);
    setErrores(nuevosErrores);
    setMensaje("");
    setErrorEnvio("");

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    setEnviando(true);

    try {
      const solicitud = await crearSolicitud({
        nombre: formulario.nombre.trim(),
        correo: formulario.correo.trim(),
        telefono: formulario.telefono.trim(),
        instrumento: formulario.instrumento,
        descripcion: formulario.descripcion.trim(),
      });

      setMensaje(
        `Solicitud N° ${solicitud.id} recibida. Estado: ${solicitud.estado}.`,
      );
      setFormulario(formularioInicial);
    } catch (error) {
      setErrorEnvio(error.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="pagina-servicios">
      <header className="encabezado-pagina">
        <p className="etiqueta">Servicio técnico</p>
        <h1>Reparación de instrumentos de cuerda</h1>
        <p>Completa el formulario para solicitar una revisión de tu instrumento.</p>
      </header>

      <section className="informacion-servicio" aria-labelledby="titulo-como-funciona">
        <h2 id="titulo-como-funciona">¿Cómo funciona?</h2>
        <ol>
          <li>Ingresa tus datos de contacto.</li>
          <li>Selecciona el tipo de instrumento.</li>
          <li>Describe brevemente el problema.</li>
          <li>Revisa el avance de tu solicitud desde tu perfil.</li>
        </ol>
      </section>

      <section className="multimedia-servicio" aria-labelledby="titulo-video">
        <h2 id="titulo-video">Cuidado de instrumentos</h2>
        <div className="contenedor-video">
          <video className="video-servicio" controls preload="metadata" playsInline>
            <source src="/media/VideoGuitarra.mp4" type="video/mp4" />
            Tu navegador no puede reproducir este video.
          </video>
        </div>
      </section>

      <section className="seccion-formulario" aria-labelledby="titulo-formulario">
        <h2 id="titulo-formulario">Solicitar revisión</h2>
        <p>Utiliza datos ficticios: es un proyecto académico.</p>

        <form className="formulario-servicio" onSubmit={enviar} noValidate>
          <fieldset>
            <legend>Datos de contacto</legend>

            <div className="campo-formulario">
              <label htmlFor="nombre">Nombre completo</label>
              <input id="nombre" name="nombre" value={formulario.nombre} onChange={cambiar} aria-invalid={Boolean(errores.nombre)} />
              <small className="mensaje-error">{errores.nombre}</small>
            </div>

            <div className="campo-formulario">
              <label htmlFor="correo">Correo electrónico</label>
              <input id="correo" name="correo" type="email" value={formulario.correo} onChange={cambiar} aria-invalid={Boolean(errores.correo)} />
              <small className="mensaje-error">{errores.correo}</small>
            </div>

            <div className="campo-formulario">
              <label htmlFor="telefono">Teléfono</label>
              <input id="telefono" name="telefono" type="tel" maxLength={9} placeholder="912345678" value={formulario.telefono} onChange={cambiar} aria-invalid={Boolean(errores.telefono)} />
              <small className="mensaje-error">{errores.telefono}</small>
            </div>
          </fieldset>

          <fieldset>
            <legend>Datos del instrumento</legend>

            <div className="campo-formulario">
              <label htmlFor="instrumento">Tipo de instrumento</label>
              <select id="instrumento" name="instrumento" value={formulario.instrumento} onChange={cambiar} aria-invalid={Boolean(errores.instrumento)}>
                <option value="">Selecciona un instrumento</option>
                <option value="guitarra-electrica">Guitarra eléctrica</option>
                <option value="guitarra-acustica">Guitarra acústica</option>
                <option value="bajo">Bajo</option>
                <option value="otro">Otro instrumento de cuerda</option>
              </select>
              <small className="mensaje-error">{errores.instrumento}</small>
            </div>

            <div className="campo-formulario">
              <label htmlFor="descripcion">Descripción del problema</label>
              <textarea id="descripcion" name="descripcion" rows={5} maxLength={500} value={formulario.descripcion} onChange={cambiar} aria-invalid={Boolean(errores.descripcion)} />
              <small className="mensaje-error">{errores.descripcion}</small>
            </div>
          </fieldset>

          <label className="aceptacion">
            <input name="aceptaCondiciones" type="checkbox" checked={formulario.aceptaCondiciones} onChange={cambiar} />
            Confirmo que los datos ingresados son ficticios.
          </label>

          <small className="mensaje-error">{errores.aceptaCondiciones}</small>

          <button type="submit" disabled={enviando}>
            {enviando ? "Enviando..." : "Enviar solicitud"}
          </button>
          <p role="status">{mensaje}</p>
          {errorEnvio && <p className="mensaje-error" role="alert">{errorEnvio}</p>}
        </form>
      </section>
    </div>
  );
}

export default Servicios;
