import { Link } from "react-router-dom";
import { publicaciones } from "../data/publicaciones";

export default function Blog() {
  return (
    <section className="container py-5">
      <p className="text-uppercase text-info fw-semibold mb-2">Contenido</p>
      <h1 className="mb-4">Blog Sonido Vivo</h1>

      <div className="row g-4">
        {publicaciones.map((publicacion) => (
          <article className="col-12 col-md-6 col-xl-4" key={publicacion.id}>
            <div className="card bg-dark text-light border-secondary h-100">
              <div className="card-body d-flex flex-column">
                <p className="small text-secondary mb-2">{publicacion.fecha}</p>
                <h2 className="h4">{publicacion.titulo}</h2>
                <p>{publicacion.resumen}</p>
                <Link className="btn btn-outline-info mt-auto" to={`/blog/${publicacion.id}`}>
                  Leer publicación
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
