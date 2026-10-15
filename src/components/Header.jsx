
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Badge } from "react-bootstrap";
import SelectorCantidad from "./SelectorCantidad";

function Header({ carrito, setCarrito }) {
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  const cantidadProductos = carrito.reduce(
    (total, producto) => total + producto.cantidad,
    0,
  );

  const totalCarrito = carrito.reduce(
    (total, producto) =>
      total + producto.precio * producto.cantidad,
    0,
  );

  function eliminarProducto(id) {
    setCarrito(
      carrito.filter((producto) => producto.id !== id),
    );
  }

  return (
    <>
      <div className="d-flex align-items-center ms-lg-3">
        <Button
          id="abrir-carrito"
          variant="outline-light"
          className="position-relative acceso-carrito"
          type="button"
          aria-label="Abrir o cerrar carrito de compras"
          aria-expanded={carritoAbierto}
          aria-controls="panel-carrito"
          onClick={() => setCarritoAbierto(!carritoAbierto)}
        >
          <span aria-hidden="true">🛒</span>
          <Badge
            id="cantidad-carrito"
            bg="danger"
            pill
            className="position-absolute top-0 start-100 translate-middle"
          >
            {cantidadProductos}
          </Badge>
        </Button>
      </div>

      {carritoAbierto && (
        <aside
          id="panel-carrito"
          className="panel-carrito abierto"
          aria-label="Carrito de compras"
        >
          <div className="panel-carrito-encabezado">
            <h2>Mi carrito</h2>

            <button
              id="cerrar-carrito"
              type="button"
              aria-label="Cerrar carrito"
              onClick={() => setCarritoAbierto(false)}
            >
              ✕
            </button>
          </div>

          <div className="panel-carrito-contenido">
            <div id="lista-carrito">
              {carrito.length === 0 ? (
                <p>Tu carrito está vacío.</p>
              ) : (
                carrito.map((producto) => (
                  <div key={producto.id} className="item-carrito">
                    <img
                      className="imagen-panel-carrito"
                      src={producto.imagen}
                      alt={producto.nombre}
                    />

                    <div className="detalle-panel-carrito">
                      <p className="nombre-panel-carrito">
                        {producto.nombre}
                      </p>

                      <div className="controles-panel-carrito">
                        <SelectorCantidad
                          producto={producto}
                          carrito={carrito}
                          setCarrito={setCarrito}
                        />

                        <button
                          type="button"
                          aria-label={`Eliminar ${producto.nombre} del carrito`}
                          onClick={() => eliminarProducto(producto.id)}
                        >
                          🗑️
                        </button>

                        <span className="precio-panel-carrito">
                          ${producto.precio.toLocaleString("es-CL")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="subtotal-panel-carrito">
              <span>{cantidadProductos} artículos</span>
              <span>${totalCarrito.toLocaleString("es-CL")}</span>
            </div>

            <div id="total-carrito-panel" className="total-carrito">
              <span>Total</span>
              <span>${totalCarrito.toLocaleString("es-CL")}</span>
            </div>

            <div id="acciones-carrito">
              {carrito.length > 0 && (
                <Link
                  to="/checkout"
                  className="boton-tramitar"
                  onClick={() => setCarritoAbierto(false)}
                >
                  TRAMITAR PEDIDO
                </Link>
              )}

              <Link
                className="boton boton-ver-carrito"
                to="/carrito"
                onClick={() => setCarritoAbierto(false)}
              >
                CARRITO
              </Link>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}

export default Header;
