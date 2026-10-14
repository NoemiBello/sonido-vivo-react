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
    </section>
  );
}
