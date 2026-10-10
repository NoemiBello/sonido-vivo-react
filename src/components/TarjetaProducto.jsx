import { Link } from "react-router-dom";
import { moneda, precioFinal } from "../utils/productos";

export default function TarjetaProducto({
  producto,
  agregarAlCarrito,
}) {
  return (
    <article className="tarjeta-producto">
      <Link to={`/productos/${producto.id}`}>
        <img
          src={producto.imagen || "/img/logo.png"}
          alt={producto.nombre}
        />
      </Link>

      {producto.descuento > 0 && (
        <span className="insignia">
          −{producto.descuento}%
        </span>
      )}

      <h2>{producto.nombre}</h2>

      <p className="precio">
        {producto.descuento > 0 && (
          <del>{moneda(producto.precio)} </del>
        )}

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
        {producto.stock === 0
          ? "Sin stock"
          : "Añadir al carrito"}
      </button>

      <Link to={`/productos/${producto.id}`}>
        Ver detalle
      </Link>
    </article>
  );
}