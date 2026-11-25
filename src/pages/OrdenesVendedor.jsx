import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useTienda } from "../context/TiendaContext";
import { buscarPedido, listarPedidos } from "../services/pedidosService";
import { fechaPedido, nombreEstado } from "../utils/pedidos";
import { leerSesion } from "../utils/storage";

// Anexo 1: el vendedor visualiza la lista de órdenes y el detalle.
export default function OrdenesVendedor() {
  const { productos } = useTienda();
  const [ordenes, setOrdenes] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargar() {
      try {
        setOrdenes(await listarPedidos());
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    }

    cargar();
  }, []);

  async function verDetalle(id) {
    setError("");

    try {
      setDetalle(await buscarPedido(id));
    } catch (e) {
      setError(e.message);
    }
  }

  function nombreProducto(id) {
    const producto = productos.find((item) => item.id === id);
    return producto ? producto.nombre : `Producto ${id}`;
  }

  if (!leerSesion()) {
    return <Navigate to="/login" replace />;
  }

  if (cargando) {
    return <p>Cargando órdenes...</p>;
  }

  return (
    <>
      <h2 className="h4">Lista de órdenes</h2>

      {error && <p className="alert alert-danger" role="alert">{error}</p>}
      {ordenes.length === 0 && <p>No hay órdenes registradas.</p>}

      <div className="table-responsive my-4">
        <table className="table table-dark table-striped align-middle">
          <thead>
            <tr>
              <th>Orden</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => (
              <tr key={orden.id}>
                <td>#{orden.id}</td>
                <td>{orden.nombreCliente}</td>
                <td className="text-nowrap">{fechaPedido(orden)}</td>
                <td>${orden.total.toLocaleString("es-CL")}</td>
                <td>{nombreEstado(orden.estado)}</td>
                <td>
                  <button className="btn btn-sm btn-outline-info" type="button" onClick={() => verDetalle(orden.id)}>
                    Ver orden
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detalle && (
        <article className="card bg-dark text-light border-secondary">
          <div className="card-body">
            <h3 className="h5">Detalle de la orden #{detalle.id}</h3>
            <p>{detalle.nombreCliente} · {detalle.direccionEntrega}</p>
            <ul>
              {detalle.detalles.map((item) => (
                <li key={item.id}>
                  {nombreProducto(item.productoId)} × {item.cantidad} · ${item.subtotal.toLocaleString("es-CL")}
                </li>
              ))}
            </ul>
          </div>
        </article>
      )}
    </>
  );
}
