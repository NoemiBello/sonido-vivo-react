import { Link } from 'react-router-dom';

function DetalleProducto({
    id,
    categoria,
    nombre,
    imagen,
    precio,
    stock,
    descripcion,
    caracteristicas,
    compatibilidad,
    agregarAlCarrito
}) {
    return (
        <article className="producto-detalle">
            <header>
                <p className="etiqueta">
                    <Link to="/catalogo">Volver al catálogo</Link>
                    {' / '}
                    {categoria}
                </p>

                <h1>{nombre}</h1>
            </header>

            <figure>
                <img src={imagen} alt={nombre} />
                <figcaption>{nombre}.</figcaption>
            </figure>

            <p className="precio">{precio}</p>

            <p className="stock-producto">
                {stock !== undefined && stock !== null
                    ? `Stock: ${stock} unidades`
                    : 'Stock por confirmar'}
            </p>


            <button
                type="button"
                className="boton-agregar"
                onClick={() => agregarAlCarrito({
                    id: Number(id),
                    nombre: nombre,
                    precio: Number(precio.replace(/[^0-9]/g, '')),
                    imagen: imagen
                })}
            >
                Agregar al carrito
            </button>


            <h2>Descripción</h2>
            <p>{descripcion}</p>

            <h2>Características</h2>
            <ul>
                {caracteristicas.map((caracteristica, index) => (
                    <li key={index}>{caracteristica}</li>
                ))}
            </ul>

            <h2>Compatibilidad</h2>
            <p>{compatibilidad}</p>

            <p>
                <p>
                    <Link to="/catalogo">Volver al catálogo</Link>
                </p>
            </p>
        </article>
    );
}

export default DetalleProducto;
