
import { useState, useEffect } from "react";

function SelectorCantidad({ producto, carrito, setCarrito }) {
    const [cantidadEscrita, setCantidadEscrita] = useState(
        String(producto.cantidad)
    );

    useEffect(() => {
        setCantidadEscrita(String(producto.cantidad));
    }, [producto.cantidad]);

    function cambiarCantidad(valor) {
        setCantidadEscrita(valor);

        if (valor === "") {
            return;
        }

        const numero = Number(valor);

        if (
            !Number.isInteger(numero) ||
            numero < 1 ||
            (producto.stock != null && numero > producto.stock)
        ) {
            return;
        }

        setCarrito(
            carrito.map((item) =>
                item.id === producto.id
                    ? { ...item, cantidad: numero }
                    : item
            )
        );
    }

    function revisarCantidad() {
        const numero = Number(cantidadEscrita);

        if (
            !Number.isInteger(numero) ||
            numero < 1 ||
            (producto.stock != null && numero > producto.stock)
        ) {
            setCantidadEscrita(String(producto.cantidad));
        }
    }


return (
    <div className="selector-cantidad">
        <input
            type="number"
            min="1"
            max={producto.stock ?? undefined}
            value={cantidadEscrita}
            aria-label={`Cantidad de ${producto.nombre}`}
            onChange={(e) => cambiarCantidad(e.target.value)}
            onBlur={revisarCantidad}
        />

        <div className="flechas-cantidad">
            <button
                type="button"
                aria-label="Aumentar cantidad"
                disabled={
                    producto.stock != null &&
                    producto.cantidad >= producto.stock
                }
                onClick={() =>
                    cambiarCantidad(String(producto.cantidad + 1))
                }
            >
                <svg viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M3 8 L6 5 L9 8" />
                </svg>
            </button>

            <button
                type="button"
                aria-label="Disminuir cantidad"
                disabled={producto.cantidad <= 1}
                onClick={() =>
                    cambiarCantidad(String(producto.cantidad - 1))
                }
            >
                <svg viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M3 4 L6 7 L9 4" />
                </svg>
            </button>
        </div>
    </div>
);

}

export default SelectorCantidad;
