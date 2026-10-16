import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import SelectorCantidad from "./SelectorCantidad";

export default function PanelCarrito({
  carrito,
  setCarrito,
  onCerrar,
}) {
  const cantidadProductos = carrito.reduce(
    (total, producto) =>
      total + producto.cantidad,
    0,
  );

  const totalCarrito = carrito.reduce(
    (total, producto) =>
      total +
      producto.precio * producto.cantidad,
    0,
  );

  function eliminarProducto(id) {
    setCarrito(
      carrito.filter(
        (producto) =>
          producto.id !== id,
      ),
    );
  }

  return (
    <aside
      className="position-fixed top-0 end-0 h-100 bg-dark text-light border-start shadow p-3 overflow-auto"
      style={{
        width: "min(92vw, 28rem)",
        zIndex: 1050,
      }}
      aria-label="Carrito de compras"
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0">
          Mi carrito
        </h2>

        <Button
          variant="outline-light"
          size="sm"
          type="button"
          onClick={onCerrar}
        >
          Cerrar
        </Button>
      </div>

      {carrito.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <div className="d-flex flex-column gap-3">
          {carrito.map((producto) => (
            <article
              key={producto.id}
              className="card bg-dark text-light border-secondary"
            >
              <div className="card-body">
                <div className="d-flex gap-3">
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    width="80"
                    height="80"
                    className="object-fit-contain rounded bg-light"
                  />

                  <div className="flex-grow-1">
                    <h3 className="h6">
                      {producto.nombre}
                    </h3>

                    <p className="mb-2">
                      $
                      {producto.precio.toLocaleString(
                        "es-CL",
                      )}
                    </p>

                    <SelectorCantidad
                      producto={producto}
                      carrito={carrito}
                      setCarrito={setCarrito}
                    />

                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="mt-2"
                      type="button"
                      onClick={() =>
                        eliminarProducto(
                          producto.id,
                        )
                      }
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <hr />

      <div className="d-flex justify-content-between">
        <span>
          {cantidadProductos} artículos
        </span>
        <strong>
          $
          {totalCarrito.toLocaleString(
            "es-CL",
          )}
        </strong>
      </div>

      <div className="d-grid gap-2 mt-4">
        {carrito.length > 0 && (
          <Link
            className="btn btn-info"
            to="/checkout"
            onClick={onCerrar}
          >
            Tramitar pedido
          </Link>
        )}

        <Link
          className="btn btn-outline-light"
          to="/carrito"
          onClick={onCerrar}
        >
          Ver carrito
        </Link>
      </div>
    </aside>
  );
}
