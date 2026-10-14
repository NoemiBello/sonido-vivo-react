import { Link, useParams } from "react-router-dom";
import { useTienda } from "../context/TiendaContext";
import Catalogo from "../components/Catalogo";

export function DetalleCategoria({ agregarAlCarrito }) {
  const { id } = useParams();
  const { categorias } = useTienda();

  const categoria = categorias.find(
    (actual) => actual.id === Number(id),
  );

  if (!categoria) {
    return (
      <section
        className="container py-4"
        data-bs-theme="dark"
      >
        <div className="alert alert-warning">
          Categoría no encontrada.
        </div>

        <Link
          to="/categorias"
          className="btn btn-outline-info"
        >
          Volver a categorías
        </Link>
      </section>
    );
  }

  return (
    <>
      <div className="container pt-4">
        <Link
          to="/categorias"
          className="btn btn-outline-info mb-3"
        >
          ← Categorías
        </Link>

        <p>{categoria.descripcion}</p>
      </div>

      <Catalogo
        categoriaId={categoria.id}
        agregarAlCarrito={agregarAlCarrito}
      />
    </>
  );
}

export default function Categorias() {
  const { categorias, productos } = useTienda();

  return (
    <section
      className="container py-4"
      data-bs-theme="dark"
    >
      <h1 className="mb-3">Categorías</h1>

      <p className="mb-4">
        Todo para tu próxima presentación.
      </p>

      <div className="row g-4">
        {categorias.map((categoria) => (
          <div
            key={categoria.id}
            className="col-6 col-lg-4"
          >
            <article className="card sv-card h-100">
              <img
                src={categoria.imagen || "/img/logo.png"}
                alt={categoria.nombre}
                className="card-img-top sv-imagen"
              />

              <div className="card-body d-flex flex-column">
                <h2 className="card-title h5">
                  {categoria.nombre}
                </h2>

                <p className="card-text">
                  {categoria.descripcion}
                </p>

                <p className="text-info">
                  {
                    productos.filter(
                      (producto) =>
                        producto.categoriaId === categoria.id,
                    ).length
                  }{" "}
                  productos
                </p>

                <Link
                  to={`/categorias/${categoria.id}`}
                  className="btn btn-outline-info mt-auto"
                >
                  Ver productos
                </Link>
              </div>
            </article>
          </div>
        ))}
      </div>

      {categorias.length === 0 && (
        <div className="alert alert-info">
          No hay categorías disponibles.
        </div>
      )}
    </section>
  );
}