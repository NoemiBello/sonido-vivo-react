
import { useState, useEffect } from "react";
import { TiendaContext } from "./TiendaContext";
import * as api from "../services/catalogoService";
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
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");

  useEffect(() => {
    const control = new AbortController();
    api.cargarCatalogo(control.signal).then((datos) => {
      if (control.signal.aborted) return;
      setProductos(datos.productos);
      setCategorias(datos.categorias);
    }).catch((error) => {
      if (!control.signal.aborted) setErrorCarga(error.message);
    }).finally(() => { if (!control.signal.aborted) setCargando(false); });
    return () => control.abort();
  }, []);

  async function recargarCatalogo() {
    setCargando(true);
    setErrorCarga("");
    try {
      const datos = await api.cargarCatalogo();
      setProductos(datos.productos);
      setCategorias(datos.categorias);
    } catch (error) { setErrorCarga(error.message); }
    finally { setCargando(false); }
  }
  async function guardarProducto(producto) {
    try {
      const nuevo = await api.guardarProducto(producto);
      setProductos((lista) => [...lista.filter((p) => p.id !== nuevo.id), nuevo].sort((a,b) => a.id-b.id));
      return nuevo;
    } catch (error) {
      if (error.producto) {
        const parcial = { ...error.producto, stock: 0, stockCritico: 0 };
        setProductos((lista) => [...lista.filter((p) => p.id !== parcial.id), parcial]);
      }
      throw error;
    }
  }
  async function eliminarProducto(id) {
    await api.eliminarProducto(id);
    setProductos((lista) => lista.filter((p) => p.id !== id));
  }
  async function guardarCategoria(categoria) {
    const nueva = await api.guardarCategoria(categoria);
    setCategorias((lista) => [...lista.filter((c) => c.id !== nueva.id), nueva].sort((a,b) => a.id-b.id));
    return nueva;
  }
  async function eliminarCategoria(id) {
    await api.eliminarCategoria(id);
    setCategorias((lista) => lista.filter((c) => c.id !== id));
  }

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
      setMensaje("No hay mas unidades disponibles.");
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

    setMensaje("Producto agregado al carrito.");
  }

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
        guardarProducto,
        eliminarProducto,
        categorias,
        guardarCategoria,
        eliminarCategoria,
        cargando,
        errorCarga,
        recargarCatalogo,
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
