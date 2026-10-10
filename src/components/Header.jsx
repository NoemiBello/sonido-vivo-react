import { useState } from "react";
import { Link } from "react-router-dom";

function Header({ carrito, setCarrito }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
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

  function cambiarCantidad(id, cambio) {
    setCarrito(
      carrito.map((producto) => {
        if (producto.id !== id) {
          return producto;
        }

        return {
          ...producto,
          cantidad: producto.cantidad + cambio,
        };
      }),
    );
  }

  function eliminarProducto(id) {
    setCarrito(
      carrito.filter((producto) => producto.id !== id),
    );
  }

  return (
    <>
      <header className="cabecera-sitio">
        <Link className="marca" to="/">
          <img
            src="/img/logo.png"
            alt="Sonido Vivo"
          />
        </Link>

        <button
          id="boton-menu"
          className="boton-menu"
          type="button"
          aria-label="Abrir o cerrar menú principal"
          aria-controls="navegacion-principal"
          aria-expanded={menuAbierto}
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          <span aria-hidden="true">☰</span>
        </button>

        <nav
          id="navegacion-principal"
          className={`navegacion-principal ${
            menuAbierto ? "menu-abierto" : ""
          }`}
          aria-label="Navegación principal"
        >
          <ul
            className="menu"
            onClick={() => setMenuAbierto(false)}
          >
            <li>
              <Link to="/">Inicio</Link>
            </li>

            <li>
              <Link to="/catalogo">Catálogo</Link>
            </li>

            <li>
              <Link to="/categorias">Categorías</Link>
            </li>

            <li>
              <Link to="/ofertas">Ofertas</Link>
            </li>

            <li>
              <Link to="/servicios">Servicios</Link>
            </li>

            <li>
              <Link to="/vendedor">Vendedor</Link>
            </li>
          </ul>
        </nav>

        <button
          id="abrir-carrito"
          className="acceso-carrito"
          type="button"
          aria-label="Abrir o cerrar carrito de compras"
          aria-expanded={carritoAbierto}
          aria-controls="panel-carrito"
          onClick={() => setCarritoAbierto(!carritoAbierto)}
        >
          <span
            className="icono-carrito"
            aria-hidden="true"
          >
            🛒
          </span>

          <span
            id="cantidad-carrito"
            className="cantidad-carrito"
          >
            {cantidadProductos}
          </span>
        </button>
      </header>

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
                  <div
                    key={producto.id}
                    className="item-carrito"
                  >
                    <p>{producto.nombre}</p>

                    <p>
                      {producto.cantidad} × $
                      {producto.precio.toLocaleString("es-CL")}
                    </p>

                    <div className="controles-panel-carrito">
                      <button
                        type="button"
                        aria-label={`Aumentar cantidad de ${producto.nombre}`}
                        disabled={
                          producto.stock !== undefined &&
                          producto.cantidad >= producto.stock
                        }
                        onClick={() =>
                          cambiarCantidad(producto.id, 1)
                        }
                      >
                        +
                      </button>

                      <button
                        type="button"
                        aria-label={`Disminuir cantidad de ${producto.nombre}`}
                        disabled={producto.cantidad <= 1}
                        onClick={() =>
                          cambiarCantidad(producto.id, -1)
                        }
                      >
                        −
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          eliminarProducto(producto.id)
                        }
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <p
              id="total-carrito-panel"
              className="total-carrito"
            >
              Total: ${totalCarrito.toLocaleString("es-CL")}
            </p>

            <div id="acciones-carrito">
              <button
                id="vaciar-carrito"
                type="button"
                onClick={() => setCarrito([])}
              >
                Vaciar carrito
              </button>

              <Link
                className="boton"
                to="/carrito"
                onClick={() => setCarritoAbierto(false)}
              >
                Ver carrito completo
              </Link>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}

export default Header;