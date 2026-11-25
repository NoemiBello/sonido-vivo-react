
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Navegacion from "./components/Navegacion";
import RutaProtegida from "./components/RutaProtegida";
import Inicio from "./components/Inicio";
import DetalleProducto from "./components/DetalleProducto";
import Catalogo from "./components/Catalogo";
import Servicios from "./components/Servicios";
import Carrito from "./components/Carrito";
import Checkout from "./components/Checkout";
import CompraExitosa from "./components/CompraExitosa";
import CompraFallida from "./components/CompraFallida";
import Footer from "./components/Footer";

import TiendaProvider from "./context/TiendaProvider";
import { useTienda } from "./context/TiendaContext";

import Categorias, { DetalleCategoria } from "./pages/Categorias";

import {
  VendedorLayout,
  ListaProductos,
  FormularioProducto,
  AdminCategorias,
} from "./pages/Vendedor";

import OrdenesVendedor from "./pages/OrdenesVendedor";
import Nosotros from "./pages/Nosotros";
import Blog from "./pages/Blog";
import DetallePublicacion from "./pages/DetallePublicacion";
import Contacto from "./pages/Contacto";
import Registro from "./pages/Registro";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import HistorialCompras from "./pages/HistorialCompras";

import AdminLayout from "./pages/admin/AdminLayout";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import AdminPedidos from "./pages/admin/AdminPedidos";
import AdminServicios from "./pages/admin/AdminServicios";
import Reportes from "./pages/admin/Reportes";
import EstilosGlobales from "./styles/EstilosGlobales";
function Contenido() {
  const {
    carritoActual,
    setCarrito,
    agregarAlCarrito,
    mensaje,
    cargando,
    errorCarga,
    recargarCatalogo,
  } = useTienda();

 return (
<BrowserRouter>
  <Navegacion
    carrito={carritoActual}
    setCarrito={setCarrito}
  />

      {mensaje && (
        <div className="sv-aviso" role="status">
          {mensaje}
        </div>
      )}

      {cargando && <p className="container py-3" role="status">Cargando catálogo…</p>}
      {errorCarga && <div className="container alert alert-danger" role="alert">{errorCarga} <button className="btn btn-outline-light" onClick={() => recargarCatalogo()}>Reintentar</button></div>}
      <main id="contenido-principal">
        {!cargando && <Routes>
          <Route path="/" element={<Inicio agregarAlCarrito={agregarAlCarrito} />} />
          <Route path="/catalogo" element={<Catalogo agregarAlCarrito={agregarAlCarrito} />} />
          <Route path="/ofertas" element={<Catalogo ofertas agregarAlCarrito={agregarAlCarrito} />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/categorias/:id" element={<DetalleCategoria agregarAlCarrito={agregarAlCarrito} />} />
          <Route path="/productos/:id" element={<DetalleProducto agregarAlCarrito={agregarAlCarrito} />} />

          {[1, 2, 3].map((id) => (
            <Route key={id} path={`/producto${id}`} element={<DetalleProducto id={id} agregarAlCarrito={agregarAlCarrito} />} />
          ))}

          <Route path="/servicios" element={<Servicios />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<DetallePublicacion />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />

          {/* Cliente: perfil y compras. El administrador tiene acceso total. */}
          <Route element={<RutaProtegida roles={["USER", "ADMIN"]} />}>
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/historial" element={<HistorialCompras />} />
            <Route path="/checkout" element={<Checkout carrito={carritoActual} setCarrito={setCarrito} />} />
          </Route>

          <Route path="/carrito" element={<Carrito carrito={carritoActual} setCarrito={setCarrito} />} />
          <Route path="/compra-exitosa" element={<CompraExitosa />} />
          <Route path="/compra-fallida" element={<CompraFallida />} />

          <Route element={<RutaProtegida roles={["VENDEDOR", "ADMIN"]} />}>
            <Route path="/vendedor" element={<VendedorLayout />}>
              <Route index element={<ListaProductos />} />
              <Route path="ordenes" element={<OrdenesVendedor />} />
              <Route path="productos/:id" element={<DetalleProducto agregarAlCarrito={agregarAlCarrito} />} />

              {/* Anexo 1: crear y editar es solo del administrador */}
              <Route element={<RutaProtegida roles={["ADMIN"]} />}>
                <Route path="stock-critico" element={<ListaProductos criticos />} />
                <Route path="productos/nuevo" element={<FormularioProducto key="nuevo" />} />
                <Route path="productos/:id/editar" element={<FormularioProducto />} />
                <Route path="categorias" element={<AdminCategorias />} />
              </Route>
            </Route>
          </Route>

          <Route element={<RutaProtegida roles={["ADMIN"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardAdmin />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
              <Route path="pedidos" element={<AdminPedidos />} />
              <Route path="servicios" element={<AdminServicios />} />
              <Route path="reportes" element={<Reportes />} />
            </Route>
          </Route>

          <Route
            path="*"
            element={
              <section className="sv-pagina">
                <h1>Página no encontrada</h1>
                <Link to="/catalogo">Ir al catálogo</Link>
              </section>
            }
          />
        </Routes>}
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <TiendaProvider>
      <EstilosGlobales />
      <Contenido />
    </TiendaProvider>
  );
}
