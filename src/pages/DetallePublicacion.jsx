
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenerPublicacionPorId } from "../services/publicacionesService";

export default function DetallePublicacion() {
  const { id } = useParams();

  const [publicacion, setPublicacion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    async function cargarPublicacion() {
      setCargando(true);
      setError("");
      setPublicacion(null);

      try {
        const datos = await obtenerPublicacionPorId(id);

        if (activo) {
          setPublicacion(datos);
        }
      } catch {
        if (activo) {
          setError(
            "No se pudo cargar la publicación. Inténtalo nuevamente."
          );
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    cargarPublicacion();

    return () => {
      activo = false;
    };
  }, [id]);

  if (cargando) {
    return (
      <section className="container py-5">
        <p className="text-secondary" role="status">
          Cargando publicación...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container py-5">
        <h1>No se pudo cargar la publicación</h1>
        <p className="text-danger" role="alert">
          {error}
        </p>
        <Link to="/blog" className="link-info">
          Volver al blog
        </Link>
      </section>
    );
  }

  if (!publicacion) {
    return (
      <section className="container py-5">
        <h1>Publicación no encontrada</h1>
        <Link to="/blog" className="link-info">
          Volver al blog
        </Link>
      </section>
    );
  }

  return (
    <article className="container py-5 manuel-lectura">
      <Link to="/blog" className="link-info">
        ← Volver al blog
      </Link>

      <p className="text-secondary mt-4 mb-2">
        {publicacion.fecha} · {publicacion.autor}
      </p>

      <h1>{publicacion.titulo}</h1>

      <p className="lead mt-4">{publicacion.resumen}</p>

      <p style={{ whiteSpace: "pre-line" }}>
        {publicacion.contenido}
      </p>
    </article>
  );
}
