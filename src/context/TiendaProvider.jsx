import { useState, useEffect } from "react";
import { TiendaContext } from "./TiendaContext";
import {
  productosIniciales,
  categoriasIniciales,
} from "../data/datos";

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

  return (
    <TiendaContext.Provider
      value={{
        productos,
        setProductos,
        categorias,
        setCategorias,
      }}
    >
      {children}
    </TiendaContext.Provider>
  );
}