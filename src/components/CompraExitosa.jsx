
import { Link } from "react-router-dom";

function CompraExitosa() {
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
