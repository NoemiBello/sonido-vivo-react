import { Link } from 'react-router-dom';
import { useState } from 'react';

function Carrusel() {
    const [diapositivaActual, setDiapositivaActual] = useState(0);

    return (
        <section
            className="carrusel"
            aria-label="Presentación principal de Sonido Vivo"
        >
            <article
                className={`diapositiva ${diapositivaActual === 0 ? 'activa' : ''}`}
            >
                <img
                    src="/img/catalogo.png"
                    alt="Equipos e instrumentos disponibles en Sonido Vivo"
                />

                <div className="contenido-diapositiva">
                    <p className="etiqueta">Equipa tu sonido</p>
                    <h1>Encuentra el equipo que necesitas</h1>
                    <p>
                        Guitarras, micrófonos y amplificadores para acompañar tu música.
                    </p>
                    <Link className="boton" to="/catalogo">
                        Explorar productos
                    </Link>

                </div>
            </article>

            <article
                className={`diapositiva ${diapositivaActual === 1 ? 'activa' : ''}`}
            >
                <img
                    src="/img/servicio%20tecnico.png"
                    alt="Servicio técnico y reparación de instrumentos"
                />

                <div className="contenido-diapositiva">
                    <p className="etiqueta">Servicio técnico</p>
                    <h2>Tu instrumento en buenas manos</h2>
                    <p>Reparación y mantenimiento de instrumentos de cuerda.</p>
                    <Link className="boton" to="/servicios">
                        Solicitar revisión
                    </Link>
                </div>
            </article>

            <div
                className="indicadores-carrusel"
                aria-label="Seleccionar diapositiva"
            >
                <button
                    className={`indicador ${diapositivaActual === 0 ? 'activo' : ''}`}
                    type="button"
                    aria-label="Mostrar catálogo"
                    aria-pressed={diapositivaActual === 0}
                    onClick={() => setDiapositivaActual(0)}
                />

                <button
                    className={`indicador ${diapositivaActual === 1 ? 'activo' : ''}`}
                    type="button"
                    aria-label="Mostrar servicio técnico"
                    aria-pressed={diapositivaActual === 1}
                    onClick={() => setDiapositivaActual(1)}
                />
            </div>
        </section>
    );
}

export default Carrusel;
