import { Link } from "react-router-dom";
import SelectorCantidad from "./SelectorCantidad";

function Carrito({ carrito, setCarrito }) {
    const total = carrito.reduce((acumulador, producto) => {
        return acumulador + producto.precio * producto.cantidad;
    }, 0);

    return (
        <div className="pagina-carrito">

            <section className="carrito-compras">
                <h1>Carrito de compras</h1>

                <section id="lista-carrito">

                    {carrito.length === 0 ? (
                        <p className="mensaje-carrito-vacio">
                            Tu carrito está vacío.
                        </p>
                    ) : (
                        carrito.map((producto) => (
                            <article
                                className="tarjeta-carrito"
                                key={producto.id}
                            >
                                <div className="informacion-producto-carrito">

                                    <img
                                        className="imagen-carrito"
                                        src={producto.imagen}
                                        alt={producto.nombre}
                                    />

                                    <p>{producto.nombre}</p>

                                    <p>
                                        Precio unitario: ${producto.precio.toLocaleString("es-CL")}
                                    </p>

                                    <p className="subtotal-producto-carrito">
                                        Subtotal: ${(producto.precio * producto.cantidad).toLocaleString("es-CL")}
                                    </p>

                                    <div className="controles-cantidad">
                                        <SelectorCantidad
                                            key={producto.id}
                                            producto={producto}
                                            carrito={carrito}
                                            setCarrito={setCarrito}
                                        />
                                    </div>

                                    {producto.stock != null && (
                                        <p className="stock-carrito">
                                            Stock disponible: {producto.stock} unidades
                                        </p>
                                    )}


                                    <button
                                        type="button"
                                        onClick={() => setCarrito(
                                            carrito.filter(
                                                (item) => item.id !== producto.id
                                            )
                                        )}
                                    >
                                        Eliminar
                                    </button>

                                </div>
                            </article>
                        ))
                    )}

                </section>
                <div className="acciones-pagina-carrito">
                    <button
                        id="vaciar-carrito"
                        type="button"
                        onClick={() => setCarrito([])}
                        disabled={carrito.length === 0}
                    >
                        Vaciar carrito
                    </button>

                    <Link to="/catalogo">
                        Seguir comprando
                    </Link>
                </div>

            </section>

            <aside className="resumen-carrito">
                <h2>Totales</h2>

                <div className="fila-resumen">
                    <span>Subtotal</span>
                    <strong id="subtotal-carrito">
                        ${total.toLocaleString("es-CL")}
                    </strong>
                </div>

                <div className="fila-resumen total-resumen">
                    <span>Total</span>

                    <strong id="total-pagina-carrito">
                        ${total.toLocaleString("es-CL")}
                    </strong>
                </div>
                {carrito.length > 0 && (
                    <Link to="/checkout" className="boton-finalizar-compra">
                        Finalizar compra
                    </Link>
                )}
            </aside>

        </div>
    );
}

export default Carrito;
