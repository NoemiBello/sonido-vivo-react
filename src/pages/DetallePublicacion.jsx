import { Link, useParams } from "react-router-dom";
import { publicaciones } from "../data/publicaciones";

export default function DetallePublicacion() {
  const { id } = useParams();
  const publicacion = publicaciones.find((item) => item.id === Number(id));

  if (!publicacion) {
    return (
      <section className="container py-5">
        <h1>Publicación no encontrada</h1>
        <Link to="/blog">Volver al blog</Link>
      </section>
    );
  }

  return (
    <article className="container py-5 manuel-lectura">
      <Link to="/blog" className="link-info">← Volver al blog</Link>
      <p className="text-secondary mt-4 mb-2">{publicacion.fecha} · {publicacion.autor}</p>
      <h1>{publicacion.titulo}</h1>
      <p className="lead mt-4">{publicacion.resumen}</p>
      <p>{publicacion.contenido}</p>
    </article>
  );
}
