import { Link } from 'react-router-dom';

function ProductosDestacados({ agregarAlCarrito }) {
    return (
        <section aria-labelledby="titulo-productos">
            <h2 id="titulo-productos">Productos destacados</h2>

            <div className="grilla-productos">

                <article className="tarjeta-producto">
                    <img
                        src="/img/guitarra-schecter.jpg"
                        alt="Guitarra eléctrica SGR by Schecter C-1 Gloss Black"
                    />
                    <h3>Guitarra eléctrica SGR by Schecter C-1 Gloss Black</h3>
                    <p>$279.900</p>
                    <Link to="/producto1">Ver detalle</Link>
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
                        Agregar al carrito
                    </button>

                </article>

                <article className="tarjeta-producto">
                    <img
                        src="/img/microfono.jpg"
                        alt="Micrófono dinámico vocal Shure SM58"
                    />
                    <h3>Micrófono dinámico vocal Shure SM58</h3>
                    <p>$129.900</p>
                    <Link to="/producto2">Ver detalle</Link>
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
                        Agregar al carrito
                    </button>
                </article>

                <article className="tarjeta-producto">
                    <img
                        src="/img/amplificador-behringe.jpg"
                        alt="Amplificador de guitarra Behringer HA-20R 20W"
                    />
                    <h3>Amplificador de guitarra Behringer HA-20R 20W</h3>
                    <p>$145.990</p>
                    <Link to="/producto3">Ver detalle</Link>
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
                        Agregar al carrito
                    </button>
                </article>

            </div>
        </section>
    );
}

export default ProductosDestacados;
