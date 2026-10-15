
import { useState, useEffect } from "react";
import { TiendaContext } from "./TiendaContext";
import {
  productosIniciales,
  categoriasIniciales,
} from "../data/datos";
import { precioFinal } from "../utils/productos";

function leer(clave, inicial) {
  try {
    const valor = JSON.parse(localStorage.getItem(clave));
    return Array.isArray(valor) ? valor : inicial;
  } catch {
    return inicial;
  }
}

export default function TiendaProvider({ children }) {
  const [productos, setProductos] = useState(() =>
    leer("svReactProductos", productosIniciales),
  );

  const [categorias, setCategorias] = useState(() =>
    leer("svReactCategorias", categoriasIniciales),
  );

  const [carrito, setCarritoOriginal] = useState(() =>
    leer("carrito", []),
  );

  const [mensaje, setMensaje] = useState("");

  function normalizar(lista) {
    return lista.flatMap((item) => {
      const producto = productos.find(
        (actual) => actual.id === Number(item.id),
      );

      if (!producto || producto.stock === 0) {
        return [];
      }

      return [
        {
          ...producto,
          precio: precioFinal(producto),
          cantidad: Math.min(
            producto.stock,
            Math.max(1, Number(item.cantidad) || 1),
          ),
        },
      ];
    });
  }

  const carritoActual = normalizar(carrito);

  function setCarrito(lista) {
    setCarritoOriginal(normalizar(lista));
  }

  function agregarAlCarrito(producto) {
    const existente = carritoActual.find(
      (actual) => actual.id === producto.id,
    );

    const cantidadActual = existente?.cantidad || 0;

    if (
      producto.stock === 0 ||
      cantidadActual >= producto.stock
    ) {
      setMensaje("No hay más unidades disponibles.");
      return;
    }

    setCarrito([
      ...carritoActual.filter(
        (actual) => actual.id !== producto.id,
      ),
      {
        ...producto,
        cantidad: cantidadActual + 1,
      },
    ]);

    setMensaje("Producto añadido al carrito.");
  }

  useEffect(() => {
    localStorage.setItem(
      "svReactProductos",
      JSON.stringify(productos),
    );
  }, [productos]);

  useEffect(() => {
    localStorage.setItem(
      "svReactCategorias",
      JSON.stringify(categorias),
    );
  }, [categorias]);

  useEffect(() => {
    localStorage.setItem(
      "carrito",
      JSON.stringify(carrito),
    );
  }, [carrito]);

  return (
    <TiendaContext.Provider
      value={{
        productos,
        setProductos,
        categorias,
        setCategorias,
        carritoActual,
        setCarrito,
        agregarAlCarrito,
        mensaje,
      }}
    >
      {children}
    </TiendaContext.Provider>
  );
}
