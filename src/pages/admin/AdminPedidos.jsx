import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { cambiarEstadoPedido, listarPedidos } from "../../services/pedidosService";
import { fechaPedido, nombreEstado, puedeCancelar, siguienteEstado } from "../../utils/pedidos";
import { leerSesion } from "../../utils/storage";

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargar() {
      try {
        setPedidos(await listarPedidos());
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    }

    cargar();
  }, []);

  async function cambiarEstado(id, estado) {
    setError("");

    try {
      const actualizado = await cambiarEstadoPedido(id, estado);

      setPedidos(
        pedidos.map((pedido) => (pedido.id === id ? actualizado : pedido)),
      );
    } catch (e) {
      setError(e.message);
    }
  }

  // Si la API rechazó el token, la sesión ya se cerró: se vuelve al login.
  if (!leerSesion()) {
    return <Navigate to="/login" replace />;
  }

  if (cargando) {
    return <p>Cargando pedidos...</p>;
  }

  return (
    <>
      <h2 className="h3">Administrar pedidos</h2>

      {error && <p className="alert alert-danger" role="alert">{error}</p>}
      {pedidos.length === 0 && <p>No hay pedidos registrados.</p>}

      <div className="table-responsive mt-4">
        <table className="table table-dark table-striped align-middle">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Entrega</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => {
              const siguiente = siguienteEstado(pedido.estado);

              return (
                <tr key={pedido.id}>
                  <td>#{pedido.id}</td>
                  <td>{pedido.nombreCliente}</td>
                  <td className="text-nowrap">{fechaPedido(pedido)}</td>
                  <td>{pedido.direccionEntrega}</td>
                  <td>${pedido.total.toLocaleString("es-CL")}</td>
                  <td>{nombreEstado(pedido.estado)}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-2">
                      {siguiente && (
                        <button className="btn btn-sm btn-outline-info" type="button" onClick={() => cambiarEstado(pedido.id, siguiente)}>
                          Pasar a {nombreEstado(siguiente)}
                        </button>
                      )}

                      {puedeCancelar(pedido.estado) && (
                        <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => cambiarEstado(pedido.id, "CANCELADO")}>
                          Cancelar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
