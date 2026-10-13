
import { Link } from "react-router-dom";
import { moneda, precioFinal } from "../utils/productos";

export default function TarjetaProducto({
  producto,
  agregarAlCarrito,
}) {
  return (
    <article className="tarjeta-producto card h-100 p-3 text-center d-flex flex-column">
      <Link
        className="d-block mb-3"
        to={`/productos/${producto.id}`}
      >
        <img
          className="img-fluid mx-auto"
          src={producto.imagen || "/img/logo.png"}
          alt={producto.nombre}
        />
      </Link>

      {producto.descuento > 0 && (
        <span className="insignia badge rounded-pill align-self-start mb-3">
          -{producto.descuento}%
        </span>
      )}

      <h2 className="h5 mb-3">{producto.nombre}</h2>

      <p className="precio fw-bold mb-3">
        {producto.descuento > 0 && (
          <del className="text-secondary me-1">
            {moneda(producto.precio)}
          </del>
        )}
        {moneda(precioFinal(producto))}
      </p>

      <p className="fw-bold mb-3">
        Stock: {producto.stock} unidades
      </p>

      <div className="mt-auto d-grid gap-3 pt-2">
        <button
          className="btn boton w-100"
          disabled={producto.stock === 0}
          onClick={() =>
            agregarAlCarrito({
              ...producto,
              precio: precioFinal(producto),
            })
          }
        >
          {producto.stock === 0
            ? "Sin stock"
            : "Añadir al carrito"}
        </button>

        <Link
        className="btn btn-outline-info align-self-center"
          to={`/productos/${producto.id}`}
        >
          Ver detalle
        </Link>
      </div>
    </article>
  );
}
