import { useState } from "react";
import Navegacion from "./Navegacion";
import PanelCarrito from "./PanelCarrito";

function Header({
  carrito,
  setCarrito,
}) {
  const [carritoAbierto, setCarritoAbierto] =
    useState(false);

  const cantidadProductos = carrito.reduce(
    (total, producto) =>
      total + producto.cantidad,
    0,
  );

  return (
    <>
      <Navegacion
        cantidadProductos={
          cantidadProductos
        }
        carritoAbierto={carritoAbierto}
        onAlternarCarrito={() =>
          setCarritoAbierto(
            !carritoAbierto,
          )
        }
      />

      {carritoAbierto && (
        <PanelCarrito
          carrito={carrito}
          setCarrito={setCarrito}
          onCerrar={() =>
            setCarritoAbierto(false)
          }
        />
      )}
    </>
  );
}

export default Header;
