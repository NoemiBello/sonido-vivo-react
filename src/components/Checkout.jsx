import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Checkout({ carrito, setCarrito }) {
    const navigate = useNavigate();
    const [tipoEntrega, setTipoEntrega] = useState("");
    function confirmarCompra(e) {
        e.preventDefault();
        setCarrito([]);
        navigate("/compra-exitosa");
    }
    const total = carrito.reduce(
        (acumulado, producto) =>
            acumulado + producto.precio * producto.cantidad,
        0
    );
    return (
        <main className="pagina-checkout">
            <h1>Finalizar compra</h1>

            <section className="formulario-checkout">
                <h2>Datos del comprador</h2>

                <form onSubmit={confirmarCompra}>
                    <div>
                        <label htmlFor="nombre">Nombre completo</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            minLength={3}
                            maxLength={80}
                            pattern="[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+"
                            title="Ingresa tu nombre usando solo letras y espacios."
                            required
                        />

                    </div>

                    <div>
                        <label htmlFor="correo">Correo electrónico</label>
                        <input
                            type="email"
                            id="correo"
                            name="correo"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="tipoEntrega">Tipo de entrega</label>
                        <select
                            id="tipoEntrega"
                            name="tipoEntrega"
                            value={tipoEntrega}
                            onChange={(e) => setTipoEntrega(e.target.value)}
                            required
                        >
                            <option value="">Selecciona una opción</option>
                            <option value="despacho">Despacho a domicilio</option>
                            <option value="retiro">Retiro en tienda</option>
                        </select>
                    </div>
                    <div>
                        {tipoEntrega === "despacho" && (
                            <div>
                                <label htmlFor="direccion">Dirección de entrega</label>
                                <input
                                    type="text"
                                    id="direccion"
                                    name="direccion"
                                    minLength={8}
                                    required
                                />
                            </div>
                        )}

                    </div>

                    <button type="submit">
                        Confirmar compra
                    </button>
                </form>
            </section>

            <section className="resumen-checkout">
                <h2>Resumen del pedido</h2>

                {carrito.map((producto) => (
                    <div key={producto.id} className="producto-resumen">
                        <span>
                            {producto.nombre} × {producto.cantidad}
                        </span>

                        <span>
                            ${(producto.precio * producto.cantidad).toLocaleString("es-CL")}
                        </span>
                    </div>
                ))}

                <h3>
                    Total: ${total.toLocaleString("es-CL")}
                </h3>
            </section>
        </main>
    );
}

export default Checkout;
