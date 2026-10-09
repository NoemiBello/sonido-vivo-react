
import { useState } from 'react';
import { Link } from 'react-router-dom';
function Header({ carrito, setCarrito }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  return (
    <>
      <header className="cabecera-sitio">

        <Link className="marca" to="/">
          <img src="/img/logo.png" alt="Sonido Vivo" />
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
          className={`navegacion-principal ${menuAbierto ? 'menu-abierto' : ''}`}
          aria-label="Navegación principal"
        >
          <ul className="menu">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/catalogo">Catálogo</Link></li>
            <li><Link to="/servicios">Servicios</Link></li>
          </ul>
        </nav>

        <button
          id="abrir-carrito"
          className="acceso-carrito"
          type="button"
          aria-label="Abrir carrito de compras"
          aria-expanded={carritoAbierto}
          aria-controls="panel-carrito"
          onClick={() => setCarritoAbierto(!carritoAbierto)}
        >
          <span className="icono-carrito" aria-hidden="true">🛒</span>
          <span id="cantidad-carrito" className="cantidad-carrito">
            {carrito.reduce((total, producto) => total + producto.cantidad, 0)}
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

                  <div key={producto.id} className="item-carrito">
                    <p>{producto.nombre}</p>

                    <p>
                      {producto.cantidad} × ${producto.precio.toLocaleString("es-CL")}
                    </p>

                    <div className="controles-panel-carrito">
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

                      <button
                        type="button"
                        onClick={() => setCarrito(
                          carrito.filter((item) => item.id !== producto.id)
                        )}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>


                ))
              )}
            </div>
            <p id="total-carrito-panel" className="total-carrito">
              Total: ${carrito.reduce(
                (total, producto) => total + producto.precio * producto.cantidad,
                0
              ).toLocaleString("es-CL")}
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
