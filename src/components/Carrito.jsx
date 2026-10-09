
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
                            <article className="tarjeta-carrito" key={producto.id}>

                                <div className="informacion-producto-carrito">

                                    <img
                                        className="imagen-carrito"
                                        src={producto.imagen}
                                        alt={producto.nombre}
                                    />

                                    <p>{producto.nombre}</p>

                                    <p>
                                        {producto.cantidad} × ${producto.precio.toLocaleString("es-CL")}
                                    </p>

                                    <div className="controles-cantidad">

                                        <button
                                            type="button"
                                            onClick={() => setCarrito(
                                                carrito.map((item) =>
                                                    item.id === producto.id
                                                        ? { ...item, cantidad: item.cantidad + 1 }
                                                        : item
                                                )
                                            )}
                                        >
                                            +
                                        </button>

                                        <button
                                            type="button"
                                            disabled={producto.cantidad === 1}
                                            onClick={() => setCarrito(
                                                carrito.map((item) =>
                                                    item.id === producto.id
                                                        ? { ...item, cantidad: item.cantidad - 1 }
                                                        : item
                                                )
                                            )}
                                        >
                                            −
                                        </button>

                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setCarrito(
                                            carrito.filter((item) => item.id !== producto.id)
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
                    >
                        Vaciar carrito
                    </button>
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
            </aside>

        </div>
    );
}

export default Carrito;
