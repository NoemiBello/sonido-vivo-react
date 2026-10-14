import { Navigate } from "react-router-dom";
import { leerPedidos, leerSesion } from "../utils/storage";

export default function HistorialCompras() {
  const sesion = leerSesion();

  if (!sesion) {
    return <Navigate to="/login" replace />;
  }

  const pedidos = leerPedidos().filter(
    (pedido) => pedido.usuarioId === sesion.id,
  );

  return (
    <section className="container py-5">
      <p className="text-uppercase text-info fw-semibold mb-2">Mi cuenta</p>
      <h1>Historial de compras</h1>

      {pedidos.length === 0 ? (
        <p className="mt-4">Todavía no tienes compras registradas.</p>
      ) : (
        <div className="row g-4 mt-1">
          {pedidos.map((pedido) => (
            <article className="col-12" key={pedido.id}>
              <div className="card bg-dark text-light border-secondary">
                <div className="card-body">
                  <div className="d-flex flex-wrap justify-content-between gap-2">
                    <h2 className="h5">Pedido #{pedido.id}</h2>
                    <span className="badge text-bg-info">{pedido.estado}</span>
                  </div>

                  <p>{pedido.fecha} · {pedido.tipoEntrega}</p>

                  <ul>
                    {pedido.productos.map((producto) => (
                      <li key={producto.productoId}>
                        {producto.nombre} × {producto.cantidad}
                      </li>
                    ))}
                  </ul>

                  <strong>Total: ${pedido.total.toLocaleString("es-CL")}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
