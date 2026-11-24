
import { useEffect } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import { renovarToken } from "../services/authService";
import { cerrarSesion, guardarSesion, leerSesion } from "../utils/storage";
import { rutaPorRol } from "../utils/roles";

// El token dura 1 hora: se renueva cuando lleva más de 30 minutos emitido.
const TIEMPO_RENOVACION = 30 * 60 * 1000;

function Navegacion({ carrito, setCarrito }) {
  const navigate = useNavigate();

  // useLocation vuelve a renderizar el menú al cambiar de página,
  // así refleja la sesión después de entrar o salir.
  const location = useLocation();
  const sesion = leerSesion();
  const esVendedor = sesion?.rol === "VENDEDOR";

  // Al cargar la aplicación y al cambiar de página se revisa la sesión.
  useEffect(() => {
    async function renovar() {
      const actual = leerSesion();

      if (!actual || Date.now() - actual.inicio < TIEMPO_RENOVACION) {
        return;
      }

      try {
        const nueva = await renovarToken();
        guardarSesion({ ...nueva, id: actual.id });
      } catch {
        // Token vencido o cuenta desactivada: hay que iniciar sesión de nuevo.
        cerrarSesion();
        navigate("/login");
      }
    }

    renovar();
  }, [location.pathname, navigate]);

  function salir() {
    cerrarSesion();
    navigate("/login");
  }

  return (
    <Navbar
      expand="md"
      variant="dark"
      style={{ backgroundColor: "#0d212d" }}
    >
      <Container fluid className="px-3 px-lg-5">

        <Navbar.Brand
          as={NavLink}
          to={esVendedor ? "/vendedor" : "/"}
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
          {!esVendedor && <Header carrito={carrito} setCarrito={setCarrito} />}
        </div>

        <Navbar.Collapse
          id="menu-principal"
          className="order-md-2"
        >
          <Nav className="ms-auto">
            {/* Anexo 1: al vendedor no se le muestran los accesos de la tienda */}
            {!esVendedor && (
              <>
                <NavLink className="nav-link" to="/" end>Inicio</NavLink>
                <NavLink className="nav-link" to="/catalogo">Catálogo</NavLink>
                <NavLink className="nav-link" to="/categorias">Categorías</NavLink>
                <NavLink className="nav-link" to="/ofertas">Ofertas</NavLink>
                <NavLink className="nav-link" to="/servicios">Servicios</NavLink>
              </>
            )}

            {sesion ? (
              <>
                {sesion.rol === "ADMIN" && (
                  <NavLink className="nav-link" to="/vendedor">Productos y stock</NavLink>
                )}
                <NavLink className="nav-link" to={rutaPorRol(sesion.rol)}>
                  {sesion.rol === "USER" ? "Perfil" : "Panel"}
                </NavLink>
                <button className="nav-link" type="button" onClick={salir}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <NavLink className="nav-link" to="/login">Ingresar</NavLink>
            )}
          </Nav>
        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
}

export default Navegacion;
