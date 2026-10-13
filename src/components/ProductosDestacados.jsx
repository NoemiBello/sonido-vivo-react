
import { useTienda } from "../context/TiendaContext";
import TarjetaProducto from "./TarjetaProducto";

export default function ProductosDestacados({
  agregarAlCarrito,
}) {
  const { productos } = useTienda();

  return (
    <section className="sv-pagina container py-4">
      <h2 className="mb-4">Productos destacados</h2>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {productos.slice(0, 3).map((producto) => (
          <div className="col" key={producto.id}>
            <TarjetaProducto
              producto={producto}
              agregarAlCarrito={agregarAlCarrito}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
