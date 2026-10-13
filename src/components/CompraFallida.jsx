
import { Link } from "react-router-dom";

function CompraFallida() {
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
                  className="fs-1 text-danger"
                  aria-hidden="true"
                >
                  !
                </span>
              </div>

              <h1 className="h2 mb-4">
                No se pudo completar la compra
              </h1>

              <p className="mb-3">
                Hubo un problema al procesar tu pedido.
              </p>

              <p className="mb-4">
                Puedes volver al carrito e intentarlo nuevamente.
              </p>

              <Link
                to="/carrito"
                className="btn boton"
              >
                Volver al carrito
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default CompraFallida;
