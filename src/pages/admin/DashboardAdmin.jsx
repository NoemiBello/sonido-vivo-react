import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useTienda } from "../../context/TiendaContext";
import { listarCuentas } from "../../services/authService";
import { listarPedidos } from "../../services/pedidosService";
import { leerSesion } from "../../utils/storage";

export default function DashboardAdmin() {
  const { productos, categorias } = useTienda();
  const [pedidos, setPedidos] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargar() {
      try {
        setCuentas(await listarCuentas());
        setPedidos(await listarPedidos());
      } catch (e) {
        setError(e.message);
      }
    }

    cargar();
  }, []);

  const ventas = pedidos
    .filter((pedido) => pedido.estado === "ENTREGADO")
    .reduce((total, pedido) => total + pedido.total, 0);

  const resumen = [
    { titulo: "Productos", valor: productos.length },
    { titulo: "Categorías", valor: categorias.length },
    { titulo: "Usuarios", valor: cuentas.length },
    { titulo: "Pedidos", valor: pedidos.length },
  ];

  // Si la API rechazó el token, la sesión ya se cerró: se vuelve al login.
  if (!leerSesion()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <h2 className="h3">Resumen general</h2>

      {error && <p className="alert alert-danger" role="alert">{error}</p>}

      <div className="row g-3 my-2">
        {resumen.map((item) => (
          <div className="col-12 col-sm-6 col-xl-3" key={item.titulo}>
            <article className="card bg-dark text-light border-secondary h-100">
              <div className="card-body">
                <p className="text-secondary mb-2">{item.titulo}</p>
                <strong className="fs-2 text-info">{item.valor}</strong>
              </div>
            </article>
          </div>
        ))}
      </div>

      <div className="card bg-dark text-light border-secondary mt-4">
        <div className="card-body">
          <h3 className="h5">Ventas entregadas</h3>
          <p className="fs-3 text-info mb-0">${ventas.toLocaleString("es-CL")}</p>
        </div>
      </div>
    </>
  );
}
