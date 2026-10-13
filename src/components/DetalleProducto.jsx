
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
      <section className="sv-pagina container py-4">
        <h1 className="mb-3">Producto no encontrado</h1>

        <Link to="/catalogo" className="btn btn-outline-info">
          Volver al catálogo
        </Link>
      </section>
    );
  }

  const categoria = categorias.find(
    (actual) => actual.id === producto.categoriaId,
  );

  return (
    <section className="sv-pagina container py-4">
      <div className="mb-4">
        <Link to="/catalogo" className="text-info text-decoration-none">
          ← Volver al catálogo
        </Link>
      </div>

      <div className="row g-4 align-items-start">
        <div className="col-12 col-md-6">
          <div className="card sv-card-detalle p-3 h-100">
            <img
              className="img-fluid w-100 rounded"
              style={{
                maxHeight: "450px",
                objectFit: "contain",
              }}
              src={producto.imagen || "/img/logo.png"}
              alt={producto.nombre}
            />
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card sv-card-detalle p-4 h-100">
            <Link
              to={`/categorias/${producto.categoriaId}`}
              className="text-info text-decoration-none mb-3"
            >
              {categoria?.nombre}
            </Link>

            <h1 className="h2 mb-3">{producto.nombre}</h1>

            <p className="text-secondary mb-3">
              Código: {producto.codigo}
            </p>

            <p className="mb-4">{producto.descripcion}</p>

            <p className="precio fs-3 fw-bold mb-3">
              {moneda(precioFinal(producto))}
            </p>

            <p className="fw-bold mb-4">
              Stock: {producto.stock} unidades
            </p>

            <button
              type="button"
              className="btn boton w-100"
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
      </div>
    </section>
  );
}
