
import { Link } from 'react-router-dom';

function Catalogo({ agregarAlCarrito }) {
  return (
    <section aria-labelledby="titulo-catalogo">
      <h1 id="titulo-catalogo">Catálogo</h1>

      <div className="grilla-productos">

        <article className="tarjeta-producto">
          <img
            src="/img/guitarra-schecter.jpg"
            alt="Guitarra eléctrica SGR by Schecter C-1 Gloss Black"
          />

          <h2>Guitarra eléctrica SGR by Schecter C-1 Gloss Black</h2>
          <p>$279.900</p>

          <button
            type="button"
            className="boton-agregar"
            onClick={() => agregarAlCarrito({
              id: 1,
              nombre: "Guitarra eléctrica SGR by Schecter C-1 Gloss Black",
              precio: 279900,
              imagen: "/img/guitarra-schecter.jpg"
            })}
          >
            Añadir al carrito
          </button>

          <Link to="/producto1">Ver detalle</Link>
        </article>

        <article className="tarjeta-producto">
          <img
            src="/img/microfono.jpg"
            alt="Micrófono dinámico vocal Shure SM58"
          />

          <h2>Micrófono dinámico vocal Shure SM58</h2>
          <p>$129.900</p>

          <button
            type="button"
            className="boton-agregar"
            onClick={() => agregarAlCarrito({
              id: 2,
              nombre: "Micrófono dinámico vocal Shure SM58",
              precio: 129900,
              imagen: "/img/microfono.jpg"
            })}
          >
            Añadir al carrito
          </button>

          <Link to="/producto2">Ver detalle</Link>
        </article>

        <article className="tarjeta-producto">
          <img
            src="/img/amplificador-behringe.jpg"
            alt="Amplificador de guitarra Behringer HA-20R 20W"
          />

          <h2>Amplificador de guitarra Behringer HA-20R 20W</h2>
          <p>$145.990</p>

          <button
            type="button"
            className="boton-agregar"
            onClick={() => agregarAlCarrito({
              id: 3,
              nombre: "Amplificador de guitarra Behringer HA-20R 20W",
              precio: 145990,
              imagen: "/img/amplificador-behringe.jpg"
            })}
          >
            Añadir al carrito
          </button>

          <Link to="/producto3">Ver detalle</Link>
        </article>

      </div>
    </section>
  );
}

export default Catalogo;
