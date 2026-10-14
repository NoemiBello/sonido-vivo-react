import { useState } from "react";
import { guardarPedidos, leerPedidos } from "../../utils/storage";

const estados = [
  "En preparación",
  "Despachado",
  "Entregado",
  "Cancelado",
];

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState(() => leerPedidos());

  function cambiarEstado(id, estado) {
    const nuevaLista = pedidos.map((pedido) =>
      pedido.id === id ? { ...pedido, estado } : pedido,
    );

    setPedidos(nuevaLista);
    guardarPedidos(nuevaLista);
  }

  return (
    <>
      <h2 className="h3">Administrar pedidos</h2>

      <div className="table-responsive mt-4">
        <table className="table table-dark table-striped align-middle">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Fecha</th>
              <th>Entrega</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>#{pedido.id}</td>
                <td>{pedido.fecha}</td>
                <td>{pedido.tipoEntrega}</td>
                <td>${pedido.total.toLocaleString("es-CL")}</td>
                <td>
                  <select
                    className="form-select"
                    value={pedido.estado}
                    onChange={(evento) => cambiarEstado(pedido.id, evento.target.value)}
                  >
                    {estados.map((estado) => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
