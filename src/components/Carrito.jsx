
import { Link } from "react-router-dom";
import SelectorCantidad from "./SelectorCantidad";

function Carrito({ carrito, setCarrito }) {
  const total = carrito.reduce((acumulador, producto) => {
    return acumulador + producto.precio * producto.cantidad;
  }, 0);

  return (
    <main className="sv-pagina container py-4">
      <div className="row g-4">

        {/* Lista de productos */}
        <section className="col-12 col-lg-8">
          <div className="card sv-card text-white p-3 h-100">
            <h1 className="h3 mb-4">Carrito de compras</h1>

            {carrito.length === 0 ? (
              <div className="text-center py-5">
                <p className="mensaje-carrito-vacio mb-4">
                  Tu carrito está vacío.
                </p>

                <Link to="/catalogo" className="btn boton">
                  Explorar productos
                </Link>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {carrito.map((producto) => (
                  <article
                    className="tarjeta-carrito card sv-card text-white p-3"
                    key={producto.id}
                  >
                    <div className="row g-3 align-items-center">
                      <div className="col-12 col-sm-4 col-md-3">
                        <img
                          className="imagen-carrito img-fluid rounded carrito-imagen"
                          src={producto.imagen || "/img/logo.png"}
                          alt={producto.nombre}
                        />
                      </div>

                      <div className="col-12 col-sm-8 col-md-9">
                        <h2 className="h5 mb-3">
                          {producto.nombre}
                        </h2>

                        <p className="mb-2">
                          Precio unitario: $
                          {producto.precio.toLocaleString("es-CL")}
                        </p>

                        <p className="subtotal-producto-carrito fw-bold mb-3">
                          Subtotal: $
                          {(
                            producto.precio * producto.cantidad
                          ).toLocaleString("es-CL")}
                        </p>

                        <div className="controles-cantidad mb-3">
                          <SelectorCantidad
                            key={producto.id}
                            producto={producto}
                            carrito={carrito}
                            setCarrito={setCarrito}
                          />
                        </div>

                        {producto.stock != null && (
                          <p className="stock-carrito mb-3">
                            Stock disponible: {producto.stock} unidades
                          </p>
                        )}

                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() =>
                            setCarrito(
                              carrito.filter(
                                (item) => item.id !== producto.id
                              )
                            )
                          }
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="d-flex flex-column flex-sm-row justify-content-start align-items-stretch gap-2 mt-4">
              <button
                id="vaciar-carrito"
                type="button"
                className="btn btn-outline-danger"
                onClick={() => setCarrito([])}
                disabled={carrito.length === 0}
              >
                Vaciar carrito
              </button>

              <Link
                to="/catalogo"
                className="btn boton d-inline-flex align-items-center justify-content-center"
              >
                Seguir comprando
              </Link>
            </div>
          </div>
        </section>

        {/* Resumen de compra */}
        <aside className="col-12 col-lg-4">
          <div className="card sv-card text-white p-3">
            <h2 className="h4 mb-4">Resumen de compra</h2>

            <div className="d-flex justify-content-between gap-3 mb-3">
              <span>Subtotal</span>

              <strong id="subtotal-carrito">
                ${total.toLocaleString("es-CL")}
              </strong>
            </div>

            <hr />

            <div className="d-flex justify-content-between gap-3 mb-4">
              <span>Total</span>

              <strong
                id="total-pagina-carrito"
                className="precio"
              >
                ${total.toLocaleString("es-CL")}
              </strong>
            </div>

            {carrito.length > 0 && (
              <Link
                to="/checkout"
                className="btn boton w-100"
              >
                Finalizar compra
              </Link>
            )}
          </div>
        </aside>

      </div>
    </main>
  );
}

export default Carrito;
