import { solicitar } from "./api";

export async function cargarCatalogo(signal) {
  const [productos, categorias, inventario] = await Promise.all([
    solicitar("productos", "", { signal }),
    solicitar("categorias", "", { signal }),
    solicitar("inventario", "", { signal }),
  ]);
  const existencias = new Map(inventario.map((i) => [i.productoId, i]));
  return {
    categorias: categorias.map((c) => ({ ...c, descripcion: c.descripcion ?? "", imagen: c.imagen ?? "" })),
    productos: productos.map((p) => ({
      ...p,
      descripcion: p.descripcion ?? "",
      imagen: p.imagen ?? "",
      stock: existencias.get(p.id)?.stock ?? 0,
      stockCritico: existencias.get(p.id)?.stockCritico ?? 0,
      inventarioId: existencias.get(p.id)?.id,
    })),
  };
}

export async function guardarProducto(producto) {
  const { id, stock, stockCritico, inventarioId, ...datos } = producto;
  const guardado = await solicitar("productos", id ? `/${id}` : "", { method: id ? "PUT" : "POST", body: datos });
  try {
    let idInventario = inventarioId;
    if (!idInventario) {
      try { idInventario = (await solicitar("inventario", `/producto/${guardado.id}`)).id; }
      catch (error) { if (error.status !== 404) throw error; }
    }
    const inventario = await solicitar("inventario", idInventario ? `/${idInventario}` : "", {
      method: idInventario ? "PUT" : "POST",
      body: { productoId: guardado.id, stock, stockCritico },
    });
    return { ...guardado, stock: inventario.stock, stockCritico: inventario.stockCritico, inventarioId: inventario.id };
  } catch (error) {
    error.producto = { ...guardado, stock, stockCritico, inventarioId };
    error.message = `El producto se guardó, pero no fue posible actualizar su stock. ${error.message} Reintenta guardar.`;
    throw error;
  }
}

export const eliminarProducto = (id) => solicitar("productos", `/${id}`, { method: "DELETE" });
export const guardarCategoria = ({ id, ...datos }) => solicitar("categorias", id ? `/${id}` : "", { method: id ? "PUT" : "POST", body: datos });
export const eliminarCategoria = (id) => solicitar("categorias", `/${id}`, { method: "DELETE" });
