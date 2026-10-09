
function Servicios() {
  return (
    <div className="pagina-servicios">

      <header className="encabezado-pagina">
        <p className="etiqueta">Servicio técnico</p>

        <h1>Reparación de instrumentos de cuerda</h1>

        <p>
          En Sonido Vivo ofrecemos servicio de reparación de
          instrumentos de cuerda. Completa el formulario para
          solicitar una revisión de prueba de tu instrumento.
        </p>
      </header>

      <section
        className="informacion-servicio"
        aria-labelledby="titulo-como-funciona"
      >
        <h2 id="titulo-como-funciona">¿Cómo funciona?</h2>

        <ol>
          <li>Ingresa tus datos de contacto.</li>
          <li>Selecciona el tipo de instrumento que deseas revisar.</li>
          <li>Describe brevemente el problema que presenta.</li>
          <li>
            El formulario comprobará que la información ingresada
            sea válida.
          </li>
        </ol>
      </section>

      <section
        className="multimedia-servicio"
        aria-labelledby="titulo-video"
      >
        <h2 id="titulo-video">Cuidado de instrumentos</h2>

        <p>
          Revisa este material informativo sobre el cuidado
          y mantenimiento de instrumentos de cuerda.
        </p>

        <div className="contenedor-video">
          <video
            className="video-servicio"
            controls
            preload="metadata"
            playsInline
          >
            <source
              src="/media/VideoGuitarra.mp4"
              type="video/mp4"
            />
            Tu navegador no puede reproducir este video.
          </video>
        </div>
      </section>

      <section
        className="seccion-formulario"
        aria-labelledby="titulo-formulario"
      >
        <h2 id="titulo-formulario">Solicitar revisión</h2>

        <p>
          Utiliza solamente datos ficticios. Esta demostración
          académica no envía información a un servidor.
        </p>

        <form
          id="formulario-servicio"
          className="formulario-servicio"
          noValidate
        >
          <fieldset>
            <legend>Datos de contacto</legend>

            <div className="campo-formulario">
              <label htmlFor="nombre">Nombre completo</label>

              <input
                id="nombre"
                name="nombre"
                type="text"
                minLength={3}
                maxLength={50}
                autoComplete="name"
                required
                aria-describedby="error-nombre"
              />

              <small
                id="error-nombre"
                className="mensaje-error"
              ></small>
            </div>

            <div className="campo-formulario">
              <label htmlFor="correo">Correo electrónico</label>

              <input
                id="correo"
                name="correo"
                type="email"
                autoComplete="email"
                aria-describedby="error-correo"
              />

              <small
                id="error-correo"
                className="mensaje-error"
              ></small>
            </div>

            <div className="campo-formulario">
              <label htmlFor="telefono">Teléfono</label>

              <input
                id="telefono"
                name="telefono"
                type="tel"
                maxLength={9}
                pattern="[0-9]{9}"
                autoComplete="tel"
                placeholder="912345678"
                required
                aria-describedby="error-telefono"
              />

              <small
                id="error-telefono"
                className="mensaje-error"
              ></small>
            </div>
          </fieldset>

          <fieldset>
            <legend>Datos del instrumento</legend>

            <div className="campo-formulario">
              <label htmlFor="instrumento">
                Tipo de instrumento
              </label>

              <select
                id="instrumento"
                name="instrumento"
                required
                aria-describedby="error-instrumento"
              >
                <option value="">
                  Selecciona un instrumento
                </option>
                <option value="guitarra-electrica">
                  Guitarra eléctrica
                </option>
                <option value="guitarra-acustica">
                  Guitarra acústica
                </option>
                <option value="bajo">Bajo</option>
                <option value="otro">
                  Otro instrumento de cuerda
                </option>
              </select>

              <small
                id="error-instrumento"
                className="mensaje-error"
              ></small>
            </div>

            <div className="campo-formulario">
              <label htmlFor="descripcion">
                Descripción del problema
              </label>

              <textarea
                id="descripcion"
                name="descripcion"
                rows={5}
                minLength={20}
                maxLength={500}
                required
                aria-describedby="error-descripcion"
                placeholder="Describe brevemente qué problema presenta el instrumento"
              ></textarea>

              <small
                id="error-descripcion"
                className="mensaje-error"
              ></small>
            </div>
          </fieldset>

          <label className="aceptacion">
            <input
              id="acepta-condiciones"
              name="aceptaCondiciones"
              type="checkbox"
              required
              aria-describedby="error-condiciones"
            />
            Confirmo que los datos ingresados son ficticios
            y corresponden a una demostración académica.
          </label>

          <small
            id="error-condiciones"
            className="mensaje-error"
          ></small>

          <button type="submit">
            Validar solicitud
          </button>

          <p id="mensaje-formulario" role="status"></p>
        </form>
      </section>

    </div>
  );
}

export default Servicios;
