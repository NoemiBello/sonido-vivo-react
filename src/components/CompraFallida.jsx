import { Link } from "react-router-dom";

function CompraFallida() {
    return (
        <main className="pagina-checkout">
            <section className="formulario-checkout">
                <h1>No se pudo completar la compra</h1>

                <p>
                    Hubo un problema al procesar tu pedido.
                </p>

                <p>
                    Puedes volver al carrito e intentarlo nuevamente.
                </p>

                <Link to="/carrito">
                    Volver al carrito
                </Link>
            </section>
        </main>
    );
}

export default CompraFallida;