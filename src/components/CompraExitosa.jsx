import { Link } from "react-router-dom";

function CompraExitosa() {
    return (
        <main className="pagina-checkout">
            <section className="formulario-checkout">
                <h1>¡Compra realizada con éxito!</h1>

                <p>
                    Tu pedido en Sonido Vivo ha sido confirmado.
                </p>

                <p>
                    Gracias por comprar con nosotros.
                </p>

                <Link to="/catalogo">
                    Volver al catálogo
                </Link>
            </section>
        </main>
    );
}

export default CompraExitosa;