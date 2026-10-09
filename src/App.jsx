import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Inicio from './components/Inicio';
import DetalleProducto from './components/DetalleProducto';
import Catalogo from './components/Catalogo';
import Servicios from './components/Servicios';
import Carrito from './components/Carrito';
import Footer from './components/Footer';

import './styles/estilos.css';

function App() {

  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto) => {
    setCarrito((carritoActual) => {

      const productoExistente = carritoActual.find(
        (item) => item.id === producto.id
      );

      if (productoExistente) {
        return carritoActual.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...carritoActual, { ...producto, cantidad: 1 }];
    });
  };


  return (
    <BrowserRouter>
      <Header carrito={carrito} setCarrito={setCarrito} />

      <main id="contenido-principal">
        <Routes>
          <Route
            path="/"
            element={<Inicio agregarAlCarrito={agregarAlCarrito} />}
          />
          <Route
            path="/catalogo"
            element={<Catalogo agregarAlCarrito={agregarAlCarrito} />}
          />
          <Route path="/servicios" element={<Servicios />} />
          <Route
            path="/carrito"
            element={<Carrito carrito={carrito} setCarrito={setCarrito} />}
          />


          <Route
            path="/producto1"
            element={
              <DetalleProducto
                agregarAlCarrito={agregarAlCarrito}
                id="1"
                categoria="Guitarras eléctricas"
                nombre="Guitarra eléctrica SGR by Schecter C-1 Gloss Black"
                imagen="/img/guitarra-schecter.jpg"
                precio="$279.900"
                descripcion="Guitarra eléctrica de 6 cuerdas, ideal para quienes buscan un instrumento versátil para práctica, ensayo y presentaciones."
                caracteristicas={[
                  'Tipo: guitarra eléctrica de 6 cuerdas.',
                  'Cuerpo: basswood (tilo) con acabado Gloss Black.',
                  'Mástil: arce (maple), perfil Thin C.',
                  'Diapasón: palo de rosa con 24 trastes medium.',
                  'Cápsulas: Schecter Diamond Plus, configuración HH.',
                  'Controles: volumen, tono y selector de 3 posiciones.'
                ]}
                compatibilidad='Compatible con amplificadores y pedaleras de guitarra mediante una conexión jack estándar de 1/4". Sus cápsulas pasivas funcionan sin batería y permiten reemplazarlas por otros modelos compatibles si se desea personalizar el sonido del instrumento.'
              />
            }
          />

          <Route
            path="/producto2"
            element={
              <DetalleProducto
                agregarAlCarrito={agregarAlCarrito}
                id="2"
                categoria="Micrófonos"
                nombre="Micrófono dinámico vocal Shure SM58"
                imagen="/img/microfono.jpg"
                precio="$129.900"
                stock={8}
                descripcion="Micrófono dinámico vocal diseñado para presentaciones en vivo, ensayos y grabaciones. Su patrón cardioide ayuda a captar principalmente el sonido que viene desde el frente, reduciendo parte del ruido proveniente de los costados y la parte posterior."
                caracteristicas={[
                  'Tipo: micrófono dinámico vocal.',
                  'Patrón polar: cardioide.',
                  'Respuesta de frecuencia: 50 Hz a 15 kHz.',
                  'Conector: XLR de 3 pines.',
                  'Uso recomendado: voces en vivo, ensayos y grabaciones.',
                  'Construcción resistente para uso frecuente y transporte.'
                ]}
                compatibilidad="Compatible con consolas de audio, interfaces y otros equipos que dispongan de una entrada para micrófono XLR. Al ser un micrófono dinámico, puede utilizarse sin alimentación phantom."
              />
            }
          />

          <Route
            path="/producto3"
            element={
              <DetalleProducto
                agregarAlCarrito={agregarAlCarrito}
                id="3"
                categoria="Amplificadores"
                nombre="Amplificador Behringer HA-20R"
                imagen="/img/amplificador-behringe.jpg"
                precio="$145.990"
                stock={5}
                descripcion="Amplificador de guitarra de 20 W diseñado para práctica y ensayo. Incorpora controles que permiten ajustar el sonido del instrumento y un efecto de reverberación para añadir profundidad al audio."
                caracteristicas={[
                  'Potencia: 20 W.',
                  'Tipo: amplificador para guitarra eléctrica.',
                  'Altavoz: 8 pulgadas.',
                  'Canales: limpio y overdrive.',
                  'Ecualización: controles de graves, medios y agudos.',
                  'Efecto integrado: reverberación.'
                ]}
                compatibilidad='Compatible con guitarras eléctricas que utilicen una conexión estándar de 1/4". También permite conectar audífonos para practicar de forma privada y una fuente de audio externa para acompañar la práctica con música.'
              />
            }
          />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
