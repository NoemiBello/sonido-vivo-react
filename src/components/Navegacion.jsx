
import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Header from "./Header";

function Navegacion({ carrito, setCarrito }) {
  return (
    <Navbar
      expand="md"
      variant="dark"
      style={{ backgroundColor: "#0d212d" }}
    >
      <Container fluid className="px-3 px-lg-5">

        <Navbar.Brand
          as={NavLink}
          to="/"
          className="marca me-0 me-md-3"
          style={{ minWidth: 0, flexShrink: 1 }}
        >
          <img
            src="/img/logo.png"
            alt="Sonido Vivo"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Navbar.Brand>

        <div
          className="d-flex align-items-center ms-auto order-md-3"
          style={{ flexShrink: 0 }}
        >
          <Navbar.Toggle
            aria-controls="menu-principal"
            className="me-2"
          />
          <Header carrito={carrito} setCarrito={setCarrito} />
        </div>

        <Navbar.Collapse
          id="menu-principal"
          className="order-md-2"
        >
          <Nav className="ms-auto">
            <NavLink className="nav-link" to="/" end>Inicio</NavLink>
            <NavLink className="nav-link" to="/catalogo">Catálogo</NavLink>
            <NavLink className="nav-link" to="/categorias">Categorías</NavLink>
            <NavLink className="nav-link" to="/ofertas">Ofertas</NavLink>
            <NavLink className="nav-link" to="/servicios">Servicios</NavLink>
            <NavLink className="nav-link" to="/login">Vendedor</NavLink>
          </Nav>
        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
}

export default Navegacion;
