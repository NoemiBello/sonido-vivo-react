export default function Nosotros() {
  return (
    <section className="container py-5">
      <p className="text-uppercase text-info fw-semibold mb-2">Sobre la tienda</p>
      <h1 className="mb-4">Nosotros</h1>

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <p>Sonido Vivo es una tienda de instrumentos musicales, equipos de sonido y accesorios ubicada en Viña del Mar.</p>
          <p>La tienda cuenta con 11 años de funcionamiento y un catálogo de aproximadamente 340 referencias.</p>
          <p>Además de la venta de productos, Sonido Vivo ofrece reparación de instrumentos de cuerda.</p>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card bg-dark text-light border-secondary h-100">
            <div className="card-body">
              <h2 className="h4">Nuestro objetivo</h2>
              <p className="mb-0">
                Facilitar la compra y consulta de productos para clientes presenciales y remotos, manteniendo una experiencia simple y clara.
              </p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="h4 mt-5">Dónde estamos</h2>
      <p>Retiro en tienda: Viña del Mar, Región de Valparaíso. Lunes a viernes, de 09:00 a 18:00 hrs.</p>

      <div className="ratio ratio-16x9">
        <iframe
          title="Mapa de la tienda y punto de retiro"
          src="https://www.google.com/maps?q=Vi%C3%B1a%20del%20Mar%2C%20Chile&z=14&output=embed"
          loading="lazy"
        />
      </div>

      <a
        className="btn btn-outline-info mt-3"
        href="https://www.google.com/maps/dir/?api=1&destination=Vi%C3%B1a%20del%20Mar%2C%20Chile"
        target="_blank"
        rel="noreferrer"
      >
        Cómo llegar
      </a>
    </section>
  );
}
