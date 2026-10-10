import { useState } from "react";
import { useTienda } from "../context/TiendaContext";
import TarjetaProducto from "./TarjetaProducto";
import { precioFinal } from "../utils/productos";

export default function Catalogo({
  agregarAlCarrito,
  categoriaId,
  ofertas = false,
}) {
  const { productos, categorias } = useTienda();

  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [disponibles, setDisponibles] = useState(false);
  const [orden, setOrden] = useState("nombre");

  const lista = productos
    .filter((producto) => {
      const coincideCategoriaPagina =
        !categoriaId || producto.categoriaId === categoriaId;

      const coincideCategoriaFiltro =
        !categoria || producto.categoriaId === Number(categoria);

      const coincideOferta =
        !ofertas || producto.descuento > 0;

      const coincideDisponibilidad =
        !disponibles || producto.stock > 0;

      const texto =
        `${producto.nombre} ${producto.codigo} ${producto.descripcion}`;

      const coincideBusqueda = texto
        .toLocaleLowerCase()
        .includes(busqueda.toLocaleLowerCase());

      return (
        coincideCategoriaPagina &&
        coincideCategoriaFiltro &&
        coincideOferta &&
        coincideDisponibilidad &&
        coincideBusqueda
      );
    })
    .sort((a, b) => {
      if (orden === "nombre") {
        return a.nombre.localeCompare(b.nombre);
      }

      if (orden === "menor") {
        return precioFinal(a) - precioFinal(b);
      }

      return precioFinal(b) - precioFinal(a);
    });

  let titulo = "Catálogo de productos";

  if (ofertas) {
    titulo = "Ofertas";
  } else if (categoriaId) {
    titulo = categorias.find(
      (categoria) => categoria.id === categoriaId,
    )?.nombre;
  }

  return (
    <section className="sv-pagina">
      <p className="etiqueta">
        SONIDO VIVO / EXPLORA TU SONIDO
      </p>

      <h1>{titulo}</h1>

      <div className="sv-filtros">
        <label>
          Buscar
          <input
            type="search"
            value={busqueda}
            onChange={(evento) =>
              setBusqueda(evento.target.value)
            }
            placeholder="Nombre o código"
          />
        </label>

        {!categoriaId && (
          <label>
            Categoría
            <select
              value={categoria}
              onChange={(evento) =>
                setCategoria(evento.target.value)
              }
            >
              <option value="">Todas</option>

              {categorias.map((categoria) => (
                <option
                  key={categoria.id}
                  value={categoria.id}
                >
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </label>
        )}

        <label>
          Ordenar
          <select
            value={orden}
            onChange={(evento) =>
              setOrden(evento.target.value)
            }
          >
            <option value="nombre">Nombre</option>
            <option value="menor">Menor precio</option>
            <option value="mayor">Mayor precio</option>
          </select>
        </label>

        <label className="sv-check">
          <input
            type="checkbox"
            checked={disponibles}
            onChange={(evento) =>
              setDisponibles(evento.target.checked)
            }
          />
          Solo disponibles
        </label>
      </div>

      <p aria-live="polite">
        {lista.length} productos encontrados
      </p>

      <div className="grilla-productos">
        {lista.map((producto) => (
          <TarjetaProducto
            key={producto.id}
            producto={producto}
            agregarAlCarrito={agregarAlCarrito}
          />
        ))}
      </div>

      {lista.length === 0 && (
        <p className="sv-vacio">
          No hay productos que coincidan con tu búsqueda.
        </p>
      )}
    </section>
  );
}