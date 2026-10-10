export const precioFinal = (producto) =>
  Math.round(producto.precio * (1 - producto.descuento / 100));

export const moneda = (valor) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(valor);

export const esCritico = (producto) =>
  producto.stock <= producto.stockCritico;

export function validarProducto(producto, productos, categorias) {
  if (producto.codigo.trim().length < 3) {
    return "El código debe tener al menos 3 caracteres.";
  }

  if (
    !producto.nombre.trim() ||
    producto.nombre.trim().length > 100
  ) {
    return "El nombre debe tener entre 1 y 100 caracteres.";
  }

  if (producto.descripcion.length > 500) {
    return "La descripción admite hasta 500 caracteres.";
  }

  if (!Number.isFinite(producto.precio) || producto.precio < 0) {
    return "El precio debe ser un número positivo o cero.";
  }

  const stockValido = [
    producto.stock,
    producto.stockCritico,
  ].every((valor) => Number.isInteger(valor) && valor >= 0);

  if (!stockValido) {
    return "El stock y el umbral crítico deben ser enteros positivos o cero.";
  }

  if (
    !Number.isFinite(producto.descuento) ||
    producto.descuento < 0 ||
    producto.descuento > 100
  ) {
    return "El descuento debe estar entre 0 y 100.";
  }

  if (!categorias.some((categoria) => categoria.id === producto.categoriaId)) {
    return "Selecciona una categoría válida.";
  }

  const codigoDuplicado = productos.some(
    (actual) =>
      actual.id !== producto.id &&
      actual.codigo.toLowerCase() === producto.codigo.trim().toLowerCase(),
  );

  if (codigoDuplicado) {
    return "Ya existe un producto con ese código.";
  }

  return "";
}