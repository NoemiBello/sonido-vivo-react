
import { Link, useLocation } from "react-router-dom";

function CompraExitosa() {
  const location = useLocation();
  const pedido = location.state?.pedido;

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-9">
          <section
            className="card text-light p-4 p-md-5"
            style={{
              backgroundColor: "#0d2933",
              borderColor: "#214652",
            }}
          >
            <div className="text-center">
              <div className="mb-3">
                <span
                  className="fs-1 text-info"
                  aria-hidden="true"
                >
                  ✓
                </span>
              </div>

              <h1 className="h2 mb-4">
                ¡Compra realizada con éxito!
              </h1>

              <p className="mb-3">
                Tu pedido en Sonido Vivo ha sido confirmado.
              </p>

              <p className="mb-4">
                Gracias por comprar con nosotros.
              </p>
            </div>

            {pedido ? (
              <div className="mt-3">
                <h2 className="h4 mb-4">
                  Resumen de tu compra
                </h2>

                <p>
                  <strong>Comprador:</strong> {pedido.nombre}
                </p>

                <p>
                  <strong>Correo:</strong> {pedido.correo}
                </p>

                <p>
                  <strong>Tipo de entrega:</strong>{" "}
                  {pedido.tipoEntrega === "despacho"
                    ? "Despacho a domicilio"
                    : "Retiro en tienda"}
                </p>

                {pedido.tipoEntrega === "despacho" && (
                  <p>
                    <strong>Dirección:</strong> {pedido.direccion}
                  </p>
                )}

                <hr />

                <h3 className="h5 mb-3">
                  Productos comprados
                </h3>

                {pedido.productos.map((producto) => (
                  <div
                    key={producto.id}
                    className="d-flex justify-content-between gap-3 mb-3"
                  >
                    <span>
                      {producto.nombre} × {producto.cantidad}
                    </span>

                    <strong className="text-nowrap">
                      $
                      {(
                        producto.precio * producto.cantidad
                      ).toLocaleString("es-CL")}
                    </strong>
                  </div>
                ))}

                <hr />

                <div className="d-flex justify-content-between gap-3 mb-4">
                  <h3 className="h5">
                    Total pagado (simulado)
                  </h3>

                  <strong className="precio">
                    ${pedido.total.toLocaleString("es-CL")}
                  </strong>
                </div>
              </div>
            ) : (
              <p className="text-center mb-4">
                No hay información de un pedido reciente
                para mostrar.
              </p>
            )}

            <div className="text-center mt-3">
              <Link
                to="/catalogo"
                className="btn boton"
              >
                Volver al catálogo
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default CompraExitosa;
