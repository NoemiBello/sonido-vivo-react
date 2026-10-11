import { Link } from 'react-router-dom';
function Footer() {
  return (
    <footer className="pie-sitio">

      <div className="footer-contenido">

        <section className="footer-columna">
          <h2>Sonido Vivo</h2>

          <p>
            Instrumentos musicales, equipos de sonido y accesorios para músicos.
          </p>

          <p>Viña del Mar, Región de Valparaíso</p>

          <p>Lunes a viernes · 09:00 a 18:00 hrs.</p>
        </section>

        <section className="footer-columna">
          <h2>Navegación</h2>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/catalogo">Catálogo</Link></li>
            <li><Link to="/servicios">Servicios</Link></li>
          </ul>
        </section>

        <section className="footer-columna">
          <h2>Servicios</h2>

          <p>
            Venta de instrumentos musicales y equipos de sonido.
          </p>

          <p>
            Reparación de instrumentos de cuerda.
          </p>
        </section>

        <section className="footer-columna">
          <h2>Contacto</h2>

          <address>
            <p>
              Teléfono:
              <a href="tel:+56955142432">+56 9 5514 2432</a>
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
