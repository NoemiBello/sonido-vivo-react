
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarPublicaciones } from "../services/publicacionesService";

export default function Blog() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controlador = new AbortController();
    let activo = true;

    async function cargarPublicaciones() {
      try {
        const datos = await listarPublicaciones();

        if (activo) {
          setPublicaciones(datos);
        }
      } catch {
        if (activo) {
          setError("No se pudieron cargar las publicaciones. Inténtalo nuevamente.");
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    cargarPublicaciones();

    return () => {
      activo = false;
      controlador.abort();
    };
  }, []);

  return (
    <section className="container py-5">
      <p className="text-uppercase text-info fw-semibold mb-2">Contenido</p>
      <h1 className="mb-4">Blog Sonido Vivo</h1>

      {cargando && (
        <p className="text-secondary" role="status">
          Cargando publicaciones...
        </p>
      )}

      {error && (
        <p className="text-danger" role="alert">
          {error}
        </p>
      )}

      {!cargando && !error && publicaciones.length === 0 && (
        <p className="text-secondary">
          Todavía no hay publicaciones disponibles.
        </p>
      )}

      {!cargando && !error && publicaciones.length > 0 && (
        <div className="row g-4">
          {publicaciones.map((publicacion) => (
            <article
              className="col-12 col-md-6 col-xl-4"
              key={publicacion.id}
            >
              <div className="card bg-dark text-light border-secondary h-100">
                <div className="card-body d-flex flex-column">
                  <p className="small text-secondary mb-2">
                    {publicacion.fecha}
                  </p>

                  <h2 className="h4">{publicacion.titulo}</h2>

                  <p>{publicacion.resumen}</p>

                  <Link
                    className="btn btn-outline-info mt-auto"
                    to={`/blog/${publicacion.id}`}
                  >
                    Leer publicación
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
