
import { Link } from "react-router-dom";
import { useState } from "react";

function Carrusel() {
    const [diapositivaActual, setDiapositivaActual] = useState(0);

    return (
        <section
            id="carruselInicio"
            className="carrusel container py-4"
            aria-label="Presentación principal de Sonido Vivo"
        >
            <div className="row">
                <div className="col-12">
                    <article
                        className={`diapositiva ${
                            diapositivaActual === 0 ? "activa" : ""
                        }`}
                    >
                        {diapositivaActual === 0 && (
                            <>
                                <img
                                    src="/img/catalogo.png"
                                    alt="Equipos e instrumentos disponibles en Sonido Vivo"
                                    className="img-fluid w-100"
                                />

                                <div className="contenido-diapositiva p-4 p-md-5">
                                    <p className="etiqueta text-uppercase fw-bold">
                                        Equipa tu sonido
                                    </p>

                                    <h1 className="mb-3">
                                        Encuentra el equipo que necesitas
                                    </h1>

                                    <p className="mb-4">
                                        Guitarras, micrófonos y amplificadores
                                        para acompañar tu música.
                                    </p>

                                    <Link className="btn boton" to="/catalogo">
                                        Explorar productos
                                    </Link>
                                </div>
                            </>
                        )}
                    </article>

                    <article
                        className={`diapositiva ${
                            diapositivaActual === 1 ? "activa" : ""
                        }`}
                    >
                        {diapositivaActual === 1 && (
                            <>
                                <img
                                    src="/img/servicio%20tecnico.png"
                                    alt="Servicio técnico y reparación de instrumentos"
                                    className="img-fluid w-100"
                                />

                                <div className="contenido-diapositiva p-4 p-md-5">
                                    <p className="etiqueta text-uppercase fw-bold">
                                        Servicio técnico
                                    </p>

                                    <h2 className="mb-3">
                                        Tu instrumento en buenas manos
                                    </h2>

                                    <p className="mb-4">
                                        Reparación y mantenimiento de
                                        instrumentos de cuerda.
                                    </p>

                                    <Link className="btn boton" to="/servicios">
                                        Solicitar revisión
                                    </Link>
                                </div>
                            </>
                        )}
                    </article>

                    <div className="indicadores-carrusel d-flex justify-content-center align-items-center gap-2 p-3">
                        {[0, 1].map((indice) => (
                            <button
                                key={indice}
                                type="button"
                                className={`indicador ${
                                    diapositivaActual === indice ? "activo" : ""
                                }`}
                                aria-label={
                                    indice === 0
                                        ? "Mostrar catálogo"
                                        : "Mostrar servicio técnico"
                                }
                                aria-pressed={diapositivaActual === indice}
                                onClick={() => setDiapositivaActual(indice)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Carrusel;
