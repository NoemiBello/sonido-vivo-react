import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { listarCuentas } from "../../services/authService";
import { leerPedidos, leerSesion } from "../../utils/storage";

export default function Reportes() {
  const pedidos = leerPedidos();
  const [cuentas, setCuentas] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargar() {
      try {
        setCuentas(await listarCuentas());
      } catch (e) {
        setError(e.message);
      }
    }

    cargar();
  }, []);

  const entregados = pedidos.filter(
    (pedido) => pedido.estado === "Entregado",
  );

  const ventas = entregados.reduce(
    (total, pedido) => total + pedido.total,
    0,
  );

  const clientesActivos = cuentas.filter(
    (cuenta) => cuenta.rol === "USER" && cuenta.activo,
  ).length;

  const datos = [
    { nombre: "Pedidos registrados", valor: pedidos.length },
    { nombre: "Pedidos entregados", valor: entregados.length },
    { nombre: "Clientes activos", valor: clientesActivos },
    { nombre: "Ventas entregadas", valor: `$${ventas.toLocaleString("es-CL")}` },
  ];

  // Si la API rechazó el token, la sesión ya se cerró: se vuelve al login.
  if (!leerSesion()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <h2 className="h3">Reportes administrativos</h2>

      {error && <p className="alert alert-danger" role="alert">{error}</p>}

      <div className="row g-3 mt-2">
        {datos.map((dato) => (
          <div className="col-12 col-md-6" key={dato.nombre}>
            <article className="card bg-dark text-light border-secondary h-100">
              <div className="card-body">
                <p className="text-secondary">{dato.nombre}</p>
                <strong className="fs-3 text-info">{dato.valor}</strong>
              </div>
            </article>
          </div>
        ))}
      </div>
    </>
  );
}
