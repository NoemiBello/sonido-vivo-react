
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
        <main className="sv-pagina container py-4">
            <h1 className="mb-4">Finalizar compra</h1>

            <div className="row g-4">
                {/* Formulario del comprador */}
                <section className="col-12 col-lg-7">
                    <div className="card p-4 tarjeta-checkout h-100">
                        <h2 className="h4 mb-4">
                            Datos del comprador
                        </h2>

                        <form onSubmit={confirmarCompra}>
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
                                    pattern="[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+"
                                    title="Ingresa tu nombre usando solo letras y espacios."
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
                                    onChange={(e) =>
                                        setTipoEntrega(e.target.value)
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

                            {tipoEntrega === "despacho" && (
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
                                className="btn boton w-100 mt-3"
                            >
                                Confirmar compra
                            </button>
                        </form>
                    </div>
                </section>

                {/* Resumen del pedido */}
                <aside className="col-12 col-lg-5">
                    <div className="card p-4 tarjeta-checkout">
                        <h2 className="h4 mb-4">
                            Resumen del pedido
                        </h2>

                        {carrito.map((producto) => (
                            <div
                                key={producto.id}
                                className="d-flex justify-content-between align-items-start gap-3 mb-3"
                            >
                                <span>
                                    {producto.nombre} × {producto.cantidad}
                                </span>

                                <strong className="text-nowrap">
                                    $
                                    {(
                                        producto.precio *
                                        producto.cantidad
                                    ).toLocaleString("es-CL")}
                                </strong>
                            </div>
                        ))}

                        <hr />

                        <div className="d-flex justify-content-between gap-3">
                            <h3 className="h5 mb-0">Total</h3>

                            <strong className="precio">
                                ${total.toLocaleString("es-CL")}
                            </strong>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}

export default Checkout;
