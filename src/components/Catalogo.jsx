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
  <section
    className="container sv-pagina py-4"
    data-bs-theme="dark"
  >
    <p className="text-info">
      SONIDO VIVO / EXPLORA TU SONIDO
    </p>

    <h1 className="mb-4">{titulo}</h1>

    <div className="row g-3 align-items-end border rounded p-3 mb-4">
      <div className="col-12 col-md-6 col-lg-4">
        <label
          htmlFor="buscar-producto"
          className="form-label"
        >
          Buscar
        </label>

        <input
          id="buscar-producto"
          type="search"
          className="form-control"
          value={busqueda}
          onChange={(evento) =>
            setBusqueda(evento.target.value)
          }
          placeholder="Nombre o código"
        />
      </div>

      {!categoriaId && (
        <div className="col-12 col-md-6 col-lg-3">
          <label
            htmlFor="filtrar-categoria"
            className="form-label"
          >
            Categoría
          </label>

          <select
            id="filtrar-categoria"
            className="form-select"
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
        </div>
      )}

      <div className="col-12 col-md-6 col-lg-3">
        <label
          htmlFor="ordenar-productos"
          className="form-label"
        >
          Ordenar
        </label>

        <select
          id="ordenar-productos"
          className="form-select"
          value={orden}
          onChange={(evento) =>
            setOrden(evento.target.value)
          }
        >
          <option value="nombre">Nombre</option>
          <option value="menor">Menor precio</option>
          <option value="mayor">Mayor precio</option>
        </select>
      </div>

      <div className="col-12 col-md-6 col-lg-2">
        <div className="form-check">
          <input
            id="solo-disponibles"
            type="checkbox"
            className="form-check-input"
            checked={disponibles}
            onChange={(evento) =>
              setDisponibles(evento.target.checked)
            }
          />

          <label
            htmlFor="solo-disponibles"
            className="form-check-label"
          >
            Solo disponibles
          </label>
        </div>
      </div>
    </div>

    <p aria-live="polite" className="mb-4">
      {lista.length} productos encontrados
    </p>

    <div className="row g-4">
      {lista.map((producto) => (
        <div
          key={producto.id}
          className="col-6 col-lg-4"
        >
          <TarjetaProducto
            producto={producto}
            agregarAlCarrito={agregarAlCarrito}
          />
        </div>
      ))}
    </div>

    {lista.length === 0 && (
      <div className="alert alert-info mt-4">
        No hay productos que coincidan con tu búsqueda.
      </div>
    )}
  </section>
);
}