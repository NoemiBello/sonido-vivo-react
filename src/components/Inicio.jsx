import Carrusel from './Carrusel';
import ProductosDestacados from './ProductosDestacados';

function Inicio({ agregarAlCarrito }) {
  return (
    <div className="container">
      <Carrusel />
      <ProductosDestacados agregarAlCarrito={agregarAlCarrito} />
    </div>
  );
}

export default Inicio;