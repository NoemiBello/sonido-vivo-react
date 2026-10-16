import {
  Badge,
  Button,
  Container,
  Nav,
  Navbar,
} from "react-bootstrap";
import {
  Link,
  NavLink,
} from "react-router-dom";

const enlaces = [
  { ruta: "/", texto: "Inicio", fin: true },
  { ruta: "/catalogo", texto: "Catálogo" },
  { ruta: "/categorias", texto: "Categorías" },
  { ruta: "/ofertas", texto: "Ofertas" },
  { ruta: "/servicios", texto: "Servicios" },
  { ruta: "/nosotros", texto: "Nosotros" },
  { ruta: "/blog", texto: "Blog" },
  { ruta: "/contacto", texto: "Contacto" },
  { ruta: "/login", texto: "Ingresar" },
];

export default function Navegacion({
  cantidadProductos,
  carritoAbierto,
  onAlternarCarrito,
}) {
  return (
    <Navbar
      expand="md"
      bg="dark"
      data-bs-theme="dark"
    >
      <Container fluid>
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center gap-2"
        >
          <img
            src="/img/logo.png"
            alt="Sonido Vivo"
            width="48"
            height="48"
            className="object-fit-contain"
          />
          <span>Sonido Vivo</span>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="menu-principal"
        />

        <Navbar.Collapse id="menu-principal">
          <Nav className="ms-auto align-items-md-center">
            {enlaces.map((enlace) => (
              <NavLink
                key={enlace.ruta}
                to={enlace.ruta}
                end={enlace.fin}
                className={({ isActive }) =>
                  isActive
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                {enlace.texto}
              </NavLink>
            ))}

            <Button
              variant="outline-light"
              className="ms-md-2 position-relative"
              type="button"
              aria-label="Abrir o cerrar carrito"
              aria-expanded={carritoAbierto}
              onClick={onAlternarCarrito}
            >
              Carrito
              <Badge
                bg="danger"
                pill
                className="ms-2"
              >
                {cantidadProductos}
              </Badge>
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
