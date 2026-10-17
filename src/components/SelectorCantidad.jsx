
import { useState, useEffect } from "react";

function SelectorCantidad({ producto, carrito, setCarrito }) {
  const [cantidadEscrita, setCantidadEscrita] = useState(
    String(producto.cantidad)
  );

  useEffect(() => {
    setCantidadEscrita(String(producto.cantidad));
  }, [producto.cantidad]);

  function actualizarCantidad(numero) {
    setCantidadEscrita(String(numero));

    setCarrito(
      carrito.map((item) =>
        item.id === producto.id
          ? { ...item, cantidad: numero }
          : item
      )
    );
  }

  function cambiarCantidad(valor) {
    const numero = Number(valor);

    if (
      !Number.isInteger(numero) ||
      numero < 1 ||
      (producto.stock != null && numero > producto.stock)
    ) {
      return;
    }

    actualizarCantidad(numero);
  }

  function escribirCantidad(valor) {
    setCantidadEscrita(valor);
  }

  function revisarCantidad() {
    const numero = Number(cantidadEscrita);

    if (!Number.isInteger(numero) || numero < 1) {
      setCantidadEscrita(String(producto.cantidad));
      return;
    }

    const cantidadFinal =
      producto.stock != null
        ? Math.min(numero, producto.stock)
        : numero;

    actualizarCantidad(cantidadFinal);
  }

  return (
    <div
      className="selector-cantidad input-group"
      style={{ maxWidth: "120px" }}
    >
      <input
        type="number"
        className="form-control text-center"
        min="1"
        max={producto.stock ?? undefined}
        step="1"
        value={cantidadEscrita}
        aria-label={`Cantidad de ${producto.nombre}`}
        onChange={(e) => escribirCantidad(e.target.value)}
        onBlur={revisarCantidad}
      />

      <div className="flechas-cantidad d-flex flex-column">
        <button
          type="button"
          className="btn btn-outline-info btn-sm"
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
          className="btn btn-outline-info btn-sm"
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
