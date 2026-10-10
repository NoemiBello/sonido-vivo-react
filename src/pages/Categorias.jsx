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
      <section className="sv-pagina">
        <h1>Categoría no encontrada</h1>
        <Link to="/categorias">Volver</Link>
      </section>
    );
  }

  return (
    <>
      <div className="sv-pagina">
        <Link to="/categorias">← Categorías</Link>
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
    <section className="sv-pagina">
      <h1>Categorías</h1>
      <p>Todo para tu próxima presentación.</p>

      <div className="grilla-productos">
        {categorias.map((categoria) => (
          <Link
            className="tarjeta-producto"
            key={categoria.id}
            to={`/categorias/${categoria.id}`}
          >
            <img
              src={categoria.imagen || "/img/logo.png"}
              alt=""
            />

            <h2>{categoria.nombre}</h2>
            <p>{categoria.descripcion}</p>

            <span>
              {
                productos.filter(
                  (producto) =>
                    producto.categoriaId === categoria.id,
                ).length
              }{" "}
              productos →
            </span>
          </Link>
        ))}
      </div>

      {categorias.length === 0 && (
        <p>No hay categorías disponibles.</p>
      )}
    </section>
  );
}