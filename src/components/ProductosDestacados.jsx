import { useTienda } from "../context/TiendaContext";
import TarjetaProducto from "./TarjetaProducto";

export default function ProductosDestacados({
  agregarAlCarrito,
}) {
  const { productos } = useTienda();

  return (
    <section className="sv-pagina">
      <h2>Productos destacados</h2>

      <div className="grilla-productos">
        {productos.slice(0, 3).map((producto) => (
          <TarjetaProducto
            key={producto.id}
            producto={producto}
            agregarAlCarrito={agregarAlCarrito}
          />
        ))}
      </div>
    </section>
  );
}