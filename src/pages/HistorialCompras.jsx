import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useTienda } from "../context/TiendaContext";
import { listarPedidosDeUsuario } from "../services/pedidosService";
import { buscarUsuarioPorCorreo } from "../services/usuariosService";
import { fechaPedido, nombreEstado } from "../utils/pedidos";
import { leerSesion } from "../utils/storage";

export default function HistorialCompras() {
  const { productos } = useTienda();
  const sesion = leerSesion();
  const correo = sesion?.correo;

  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargar() {
      try {
        const usuario = await buscarUsuarioPorCorreo(correo);

        if (usuario) {
          setPedidos(await listarPedidosDeUsuario(usuario.id));
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    }

    cargar();
  }, [correo]);

  function nombreProducto(id) {
    const producto = productos.find((item) => item.id === id);
    return producto ? producto.nombre : `Producto ${id}`;
  }

  if (!sesion) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section className="container py-5">
      <p className="text-uppercase text-info fw-semibold mb-2">Mi cuenta</p>
      <h1>Historial de compras</h1>

      {error && <p className="alert alert-danger" role="alert">{error}</p>}
      {cargando && <p className="mt-4">Cargando compras...</p>}

      {!cargando && !error && pedidos.length === 0 && (
        <p className="mt-4">Todavía no tienes compras registradas.</p>
      )}

      <div className="row g-4 mt-1">
        {pedidos.map((pedido) => (
          <article className="col-12" key={pedido.id}>
            <div className="card bg-dark text-light border-secondary">
              <div className="card-body">
                <div className="d-flex flex-wrap justify-content-between gap-2">
                  <h2 className="h5">Pedido #{pedido.id}</h2>
                  <span className="badge text-bg-info">{nombreEstado(pedido.estado)}</span>
                </div>

                <p>{fechaPedido(pedido)} · {pedido.direccionEntrega}</p>

                <ul>
                  {pedido.detalles.map((detalle) => (
                    <li key={detalle.id}>
                      {nombreProducto(detalle.productoId)} × {detalle.cantidad}
                    </li>
                  ))}
                </ul>

                <strong>Total: ${pedido.total.toLocaleString("es-CL")}</strong>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
