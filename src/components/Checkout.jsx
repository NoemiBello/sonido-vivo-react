import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  guardarPedidos,
  leerPedidos,
  leerSesion,
} from "../utils/storage";

const servicioPedidosReal = {
  guardarPedidos,
  leerPedidos,
  leerSesion,
};

function Checkout({
  carrito,
  setCarrito,
  servicioPedidos = servicioPedidosReal,
}) {
  const navigate = useNavigate();
  const sesion =
    servicioPedidos.leerSesion();

  const [tipoEntrega, setTipoEntrega] =
    useState("");

  const [nombre, setNombre] = useState(
    sesion
      ? `${sesion.nombre} ${sesion.apellido}`.trim()
      : "",
  );

  const [correo, setCorreo] = useState(
    sesion?.correo || "",
  );

  const total = carrito.reduce(
    (acumulado, producto) =>
      acumulado +
      producto.precio *
        producto.cantidad,
    0,
  );

  function confirmarCompra(evento) {
    evento.preventDefault();

    const pedidos =
      servicioPedidos.leerPedidos();

    const nuevoPedido = {
      id: Date.now(),
      usuarioId: sesion?.id ?? null,
      fecha: new Date()
        .toISOString()
        .slice(0, 10),
      estado: "En preparación",
      tipoEntrega:
        tipoEntrega === "despacho"
          ? "Despacho"
          : "Retiro en tienda",
      productos: carrito.map(
        (producto) => ({
          productoId: producto.id,
          nombre: producto.nombre,
          cantidad: producto.cantidad,
          precio: producto.precio,
        }),
      ),
      total,
    };

    servicioPedidos.guardarPedidos([
      ...pedidos,
      nuevoPedido,
    ]);

    setCarrito([]);
    navigate("/compra-exitosa");
  }

  return (
    <main className="container py-4">
      <h1 className="mb-4">
        Finalizar compra
      </h1>

      <div className="row g-4">
        <section className="col-12 col-lg-7">
          <div className="card p-4 h-100">
            <h2 className="h4 mb-4">
              Datos del comprador
            </h2>

            <form
              onSubmit={confirmarCompra}
            >
              <div className="mb-3">
                <label
                  htmlFor="nombre"
                  className="form-label"
                >
                  Nombre completo
                </label>

                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  name="nombre"
                  minLength={3}
                  maxLength={80}
                  value={nombre}
                  onChange={(evento) =>
                    setNombre(
                      evento.target.value,
                    )
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label
                  htmlFor="correo"
                  className="form-label"
                >
                  Correo electrónico
                </label>

                <input
                  type="email"
                  className="form-control"
                  id="correo"
                  name="correo"
                  value={correo}
                  onChange={(evento) =>
                    setCorreo(
                      evento.target.value,
                    )
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label
                  htmlFor="tipoEntrega"
                  className="form-label"
                >
                  Tipo de entrega
                </label>

                <select
                  className="form-select"
                  id="tipoEntrega"
                  name="tipoEntrega"
                  value={tipoEntrega}
                  onChange={(evento) =>
                    setTipoEntrega(
                      evento.target.value,
                    )
                  }
                  required
                >
                  <option value="">
                    Selecciona una opción
                  </option>
                  <option value="despacho">
                    Despacho a domicilio
                  </option>
                  <option value="retiro">
                    Retiro en tienda
                  </option>
                </select>
              </div>

              {tipoEntrega ===
                "despacho" && (
                <div className="mb-3">
                  <label
                    htmlFor="direccion"
                    className="form-label"
                  >
                    Dirección de entrega
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    id="direccion"
                    name="direccion"
                    minLength={8}
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn btn-info w-100 mt-3"
                disabled={
                  carrito.length === 0
                }
              >
                Confirmar compra
              </button>
            </form>
          </div>
        </section>

        <aside className="col-12 col-lg-5">
          <div className="card p-4">
            <h2 className="h4 mb-4">
              Resumen del pedido
            </h2>

            {carrito.map((producto) => (
              <div
                key={producto.id}
                className="d-flex justify-content-between align-items-start gap-3 mb-3"
              >
                <span>
                  {producto.nombre} ×{" "}
                  {producto.cantidad}
                </span>

                <strong className="text-nowrap">
                  $
                  {(
                    producto.precio *
                    producto.cantidad
                  ).toLocaleString(
                    "es-CL",
                  )}
                </strong>
              </div>
            ))}

            <hr />

            <div className="d-flex justify-content-between gap-3">
              <h3 className="h5 mb-0">
                Total
              </h3>

              <strong>
                $
                {total.toLocaleString(
                  "es-CL",
                )}
              </strong>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default Checkout;
