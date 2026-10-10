import { Link, useParams } from "react-router-dom";
import { useTienda } from "../context/TiendaContext";
import { moneda, precioFinal } from "../utils/productos";

export default function DetalleProducto({
  agregarAlCarrito,
  id: idProp,
}) {
  const { id } = useParams();
  const { productos, categorias } = useTienda();

  const producto = productos.find(
    (actual) => actual.id === Number(idProp || id),
  );

  if (!producto) {
    return (
      <section className="sv-pagina">
        <h1>Producto no encontrado</h1>
        <Link to="/catalogo">Volver al catálogo</Link>
      </section>
    );
  }

  const categoria = categorias.find(
    (actual) => actual.id === producto.categoriaId,
  );

  return (
    <article className="sv-pagina">
      <Link to="/catalogo">← Catálogo</Link>

      <div className="sv-detalle">
        <img
          src={producto.imagen || "/img/logo.png"}
          alt={producto.nombre}
        />

        <div>
          <Link to={`/categorias/${producto.categoriaId}`}>
            {categoria?.nombre}
          </Link>

          <h1>{producto.nombre}</h1>
          <p>Código: {producto.codigo}</p>
          <p>{producto.descripcion}</p>

          <p className="precio">
            {moneda(precioFinal(producto))}
          </p>

          <p>Stock: {producto.stock} unidades</p>

          <button
            className="boton"
            disabled={producto.stock === 0}
            onClick={() =>
              agregarAlCarrito({
                ...producto,
                precio: precioFinal(producto),
              })
            }
          >
            {producto.stock > 0
              ? "Añadir al carrito"
              : "Sin stock"}
          </button>
        </div>
      </div>
    </article>
  );
}