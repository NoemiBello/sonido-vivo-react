
import Carrusel from './Carrusel';
import ProductosDestacados from './ProductosDestacados';

function Inicio({ agregarAlCarrito }) {
  return (
    <>
      <Carrusel />
      <ProductosDestacados agregarAlCarrito={agregarAlCarrito} />
    </>
  );
}

export default Inicio;
