import Carrusel from "./Carrusel";
import ProductosDestacados from "./ProductosDestacados";

function Inicio({ agregarAlCarrito }) {
  return (
    <main>
      <Carrusel />

      <ProductosDestacados
        agregarAlCarrito={agregarAlCarrito}
      />
    </main>
  );
}

export default Inicio;
