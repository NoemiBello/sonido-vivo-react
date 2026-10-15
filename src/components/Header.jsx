import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import SelectorCantidad from "./SelectorCantidad";

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
  function eliminarProducto(id) {
    setCarrito(
      carrito.filter((producto) => producto.id !== id),
    );
  }

  return (
    <>
      <header
        className="navbar navbar-expand-lg navbar-dark px-3 px-lg-5 py-3 gap-3"
        style={{ backgroundColor: "#0d212d" }}
      >
        <Link className="navbar-brand marca me-auto" to="/">
          <img src="/img/logo.png" alt="Sonido Vivo" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-label="Abrir o cerrar menú principal"
          aria-controls="navegacion-principal"
          aria-expanded={menuAbierto}
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <nav
          id="navegacion-principal"
          className={`collapse navbar-collapse ${menuAbierto ? "show" : ""}`}
          aria-label="Navegación principal"
        >
          <ul className="navbar-nav ms-auto gap-lg-2">
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                onClick={() => setMenuAbierto(false)}
              >
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/catalogo"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                onClick={() => setMenuAbierto(false)}
              >
                Catálogo
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/categorias"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                onClick={() => setMenuAbierto(false)}
              >
                Categorías
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/ofertas"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                onClick={() => setMenuAbierto(false)}
              >
                Ofertas
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/servicios"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                onClick={() => setMenuAbierto(false)}
              >
                Servicios
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                onClick={() => setMenuAbierto(false)}
              >
                Perfil
              </NavLink>
            </li>
          </ul>
        </nav>

        <button
          id="abrir-carrito"
          className="btn btn-outline-light position-relative acceso-carrito"
          type="button"
          aria-label="Abrir o cerrar carrito de compras"
          aria-expanded={carritoAbierto}
          aria-controls="panel-carrito"
          onClick={() => setCarritoAbierto(!carritoAbierto)}
        >
          <span aria-hidden="true">🛒</span>
          <span
            id="cantidad-carrito"
            className="badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle"
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

            <div
              id="total-carrito-panel"
              className="total-carrito"
            >
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
