
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="pie-sitio">

<div className="footer-contenido bootstrap-grid container-fluid d-block w-100 mw-100 mx-0 px-3 px-lg-5 py-4 py-lg-5">
  
        <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-4">

          <section className="footer-columna col">
            <h2>Sonido Vivo</h2>

            <p>
              Instrumentos musicales, equipos de sonido y accesorios para músicos.
            </p>

            <p>Viña del Mar, Región de Valparaíso</p>

            <p>Lunes a viernes · 09:00 a 18:00 hrs.</p>
          </section>

          <section className="footer-columna col">
            <h2>Navegación</h2>

            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/catalogo">Catálogo</Link></li>
              <li><Link to="/servicios">Servicios</Link></li>
            </ul>
          </section>

          <section className="footer-columna col">
            <h2>Servicios</h2>

            <p>
              Venta de instrumentos musicales y equipos de sonido.
            </p>

            <p>
              Reparación de instrumentos de cuerda.
            </p>
          </section>

          <section className="footer-columna col">
            <h2>Contacto</h2>

            <address>
              <p>
                Teléfono:
                <a href="tel:+56955142432"> +56 9 5514 2432</a>
              </p>

              <p>
                Email:
                <a href="mailto:contacto@sonidovivo.cl">
                  contacto@sonidovivo.cl
                </a>
              </p>
            </address>
          </section>

        </div>
      </div>

      <div className="footer-inferior">
        <p>
          <small>
            © 2026 Sonido Vivo · Proyecto académico Desarrollo FullStack II
          </small>
        </p>
      </div>

    </footer>
  );
}

export default Footer;
