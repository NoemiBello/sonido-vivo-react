import { useState } from "react";
import {
  Link,
  NavLink,
  Navigate,
  Outlet,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useTienda } from "../context/TiendaContext";
import {
  esCritico,
  moneda,
  validarProducto,
} from "../utils/productos";

// ACCESO DEL VENDEDOR

export function AccesoVendedor() {
  const navigate = useNavigate();

  function entrar(evento) {
    evento.preventDefault();

    const datos = new FormData(evento.target);

    localStorage.setItem("sesionActiva", "true");
    localStorage.setItem("tipoUsuario", "vendedor");
    localStorage.setItem("correoUsuario", datos.get("correo"));

    navigate("/vendedor");
  }

  return (
    <section
      className="container sv-pagina py-4"
      data-bs-theme="dark"
    >
      <h1 className="mb-3">Acceso del vendedor</h1>

      <p className="text-body-secondary">
        Acceso de demostración para la evaluación.
        No verifica credenciales en un servidor.
      </p>

      <form className="row g-3 my-3" onSubmit={entrar}>
        <div className="col-12 col-md-6">
          <label htmlFor="correo-vendedor" className="form-label">
            Correo
          </label>

          <input
            id="correo-vendedor"
            className="form-control"
            name="correo"
            type="email"
            autoComplete="username"
            required
          />
        </div>

        <div className="col-12 col-md-6">
          <label
            htmlFor="clave-vendedor"
            className="form-label"
          >
            Contraseña de demostración
          </label>

          <input
            id="clave-vendedor"
            className="form-control"
            type="password"
            autoComplete="current-password"
            minLength={4}
            maxLength={10}
            required
          />
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-sonido">
            Ingresar
          </button>
        </div>
      </form>
    </section>
  );
}

// ESTRUCTURA DEL PANEL

export function VendedorLayout() {
  const navigate = useNavigate();

  const sesionActiva =
    localStorage.getItem("sesionActiva") === "true";

  const esVendedor =
    localStorage.getItem("tipoUsuario") === "vendedor";

  if (!sesionActiva || !esVendedor) {
    return <Navigate to="/login" replace />;
  }

  function salir() {
    localStorage.removeItem("sesionActiva");
    localStorage.removeItem("tipoUsuario");
    localStorage.removeItem("correoUsuario");

    navigate("/login");
  }

  return (
    <section
      className="container sv-pagina py-4"
      data-bs-theme="dark"
    >
      <p className="text-info mb-2">ADMINISTRACIÓN</p>

      <h1 className="mb-3">Panel del vendedor</h1>

      <p className="text-body-secondary">
        {localStorage.getItem("correoUsuario")}
      </p>

      <nav
        className="nav nav-pills gap-2 my-4"
        aria-label="Administración del vendedor"
      >
        <NavLink
          end
          to="/vendedor"
          className="nav-link"
        >
          Productos
        </NavLink>

        <NavLink
          to="/vendedor/categorias"
          className="nav-link"
        >
          Categorías
        </NavLink>

        <NavLink
          to="/vendedor/stock-critico"
          className="nav-link"
        >
          Stock crítico
        </NavLink>

        <button
          type="button"
          className="btn btn-outline-danger ms-md-auto"
          onClick={salir}
        >
          Cerrar sesión
        </button>
      </nav>

      <Outlet />
    </section>
  );
}

// LISTADO DE PRODUCTOS Y STOCK CRÍTICO

export function ListaProductos({ criticos = false }) {
  const {
    productos,
    setProductos,
    categorias,
  } = useTienda();

  const [busqueda, setBusqueda] = useState("");

  const lista = productos.filter((producto) => {
    const coincideStock =
      !criticos || esCritico(producto);

    const coincideBusqueda =
      `${producto.nombre} ${producto.codigo}`
        .toLowerCase()
        .includes(busqueda.toLowerCase());

    return coincideStock && coincideBusqueda;
  });

  const stockTotal = productos.reduce(
    (total, producto) => total + producto.stock,
    0,
  );

  const cantidadCriticos = productos.filter(esCritico).length;

  function eliminar(producto) {
    const confirmar = window.confirm(
      `¿Eliminar ${producto.nombre}?`,
    );

    if (confirmar) {
      setProductos(
        productos.filter(
          (actual) => actual.id !== producto.id,
        ),
      );
    }
  }

  return (
    <>
      <div className="row g-3 my-4">
        <div className="col-12 col-md-4">
          <article className="card sv-card h-100">
            <div className="card-body">
              <strong className="d-block fs-2 text-info">
                {productos.length}
              </strong>

              <span>Productos</span>
            </div>
          </article>
        </div>

        <div className="col-12 col-md-4">
          <article className="card sv-card h-100">
            <div className="card-body">
              <strong className="d-block fs-2 text-info">
                {stockTotal}
              </strong>

              <span>Unidades en stock</span>
            </div>
          </article>
        </div>

        <div className="col-12 col-md-4">
          <article className="card sv-card h-100">
            <div className="card-body">
              <strong className="d-block fs-2 text-warning">
                {cantidadCriticos}
              </strong>

              <span>Stock crítico</span>
            </div>
          </article>
        </div>
      </div>

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 my-4">
        <h2 className="h4 mb-0">
          {criticos
            ? "Productos con stock crítico"
            : "Administrar productos"}
        </h2>

        <Link
          className="btn btn-sonido"
          to="/vendedor/productos/nuevo"
        >
          Crear producto
        </Link>
      </div>

      <div className="mb-3">
        <label
          htmlFor="buscar-producto-vendedor"
          className="form-label"
        >
          Buscar producto
        </label>

        <input
          id="buscar-producto-vendedor"
          className="form-control"
          type="search"
          value={busqueda}
          placeholder="Nombre o código"
          onChange={(evento) =>
            setBusqueda(evento.target.value)
          }
        />
      </div>

      <div className="table-responsive my-4">
        <table className="table table-dark table-striped align-middle">
          <thead>
            <tr>
              <th scope="col">Producto</th>
              <th scope="col">Categoría</th>
              <th scope="col">Precio base</th>
              <th scope="col">Stock / mínimo</th>
              <th scope="col">Estado</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {lista.map((producto) => (
              <tr key={producto.id}>
                <td>
                  <strong>{producto.nombre}</strong>

                  <small className="d-block text-body-secondary">
                    {producto.codigo}
                  </small>
                </td>

                <td>
                  {
                    categorias.find(
                      (categoria) =>
                        categoria.id === producto.categoriaId,
                    )?.nombre
                  }
                </td>

                <td className="text-nowrap">
                  {moneda(producto.precio)}
                </td>

                <td className="text-nowrap">
                  {producto.stock} / {producto.stockCritico}
                </td>

                <td>
                  <span
                    className={`badge ${
                      producto.stock === 0
                        ? "text-bg-danger"
                        : esCritico(producto)
                          ? "text-bg-warning"
                          : "text-bg-success"
                    }`}
                  >
                    {producto.stock === 0
                      ? "Sin stock"
                      : esCritico(producto)
                        ? "Stock crítico"
                        : "Disponible"}
                  </span>
                </td>

                <td>
                  <div className="d-flex flex-wrap gap-2">
                    <Link
                      className="btn btn-sm btn-outline-info"
                      to={`/vendedor/productos/${producto.id}/editar`}
                    >
                      Editar / stock
                    </Link>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => eliminar(producto)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {lista.length === 0 && (
        <div className="alert alert-info">
          No hay productos para mostrar.
        </div>
      )}
    </>
  );
}

// CREAR Y EDITAR PRODUCTOS

export function FormularioProducto() {
  const { id } = useParams();

  const {
    productos,
    setProductos,
    categorias,
  } = useTienda();

  const navigate = useNavigate();

  const existente = productos.find(
    (producto) => producto.id === Number(id),
  );

  const [form, setForm] = useState(
    () =>
      existente || {
        codigo: "",
        nombre: "",
        descripcion: "",
        precio: 0,
        stock: 0,
        stockCritico: 2,
        descuento: 0,
        categoriaId: categorias[0]?.id || "",
        imagen: "",
      },
  );

  const [error, setError] = useState("");

  if (id && !existente) {
    return (
      <div className="alert alert-warning">
        Producto no encontrado.{" "}

        <Link to="/vendedor" className="alert-link">
          Volver al panel
        </Link>
      </div>
    );
  }

  function cambiar(evento) {
    const { name, value } = evento.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  function guardar(evento) {
    evento.preventDefault();

    const producto = {
      ...form,
      id: existente?.id || Date.now(),
      codigo: form.codigo.trim(),
      nombre: form.nombre.trim(),
      precio: Number(form.precio),
      stock: Number(form.stock),
      stockCritico: Number(form.stockCritico),
      descuento: Number(form.descuento),
      categoriaId: Number(form.categoriaId),
    };

    const mensaje = validarProducto(
      producto,
      productos,
      categorias,
    );

    if (mensaje) {
      setError(mensaje);
      return;
    }

    if (existente) {
      setProductos(
        productos.map((actual) =>
          actual.id === producto.id
            ? producto
            : actual,
        ),
      );
    } else {
      setProductos([...productos, producto]);
    }

    navigate("/vendedor");
  }

  const camposNumericos = [
    {
      nombre: "precio",
      etiqueta: "Precio base ($)",
    },
    {
      nombre: "stock",
      etiqueta: "Stock disponible",
    },
    {
      nombre: "stockCritico",
      etiqueta: "Umbral de stock crítico",
    },
    {
      nombre: "descuento",
      etiqueta: "Descuento (%)",
    },
  ];

  return (
    <>
      <h2 className="h4 mb-4">
        {existente
          ? "Editar producto y stock"
          : "Crear producto"}
      </h2>

      <form className="row g-3 my-3" onSubmit={guardar}>
        <div className="col-12 col-md-6">
          <label htmlFor="codigo-producto" className="form-label">
            Código
          </label>

          <input
            id="codigo-producto"
            className="form-control"
            name="codigo"
            value={form.codigo}
            onChange={cambiar}
            minLength={3}
            required
          />
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="nombre-producto" className="form-label">
            Nombre
          </label>

          <input
            id="nombre-producto"
            className="form-control"
            name="nombre"
            value={form.nombre}
            onChange={cambiar}
            maxLength={100}
            required
          />
        </div>

        <div className="col-12">
          <label
            htmlFor="descripcion-producto"
            className="form-label"
          >
            Descripción
          </label>

          <textarea
            id="descripcion-producto"
            className="form-control"
            name="descripcion"
            rows={4}
            value={form.descripcion}
            onChange={cambiar}
            maxLength={500}
          />
        </div>

        <div className="col-12 col-md-6">
          <label
            htmlFor="categoria-producto"
            className="form-label"
          >
            Categoría
          </label>

          <select
            id="categoria-producto"
            className="form-select"
            name="categoriaId"
            value={form.categoriaId}
            onChange={cambiar}
            required
          >
            <option value="">Seleccionar</option>

            {categorias.map((categoria) => (
              <option
                key={categoria.id}
                value={categoria.id}
              >
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="imagen-producto" className="form-label">
            Imagen (ruta /img/... o URL HTTPS)
          </label>

          <input
            id="imagen-producto"
            className="form-control"
            name="imagen"
            value={form.imagen}
            onChange={cambiar}
            pattern="(/[^ ].*|https://[^ ]+)"
            placeholder="/img/guitarra-schecter.jpg"
          />
        </div>

        {camposNumericos.map((campo) => (
          <div
            key={campo.nombre}
            className="col-12 col-md-6"
          >
            <label
              htmlFor={`producto-${campo.nombre}`}
              className="form-label"
            >
              {campo.etiqueta}
            </label>

            <input
              id={`producto-${campo.nombre}`}
              className="form-control"
              name={campo.nombre}
              type="number"
              min="0"
              max={
                campo.nombre === "descuento"
                  ? 100
                  : undefined
              }
              step={
                campo.nombre === "precio"
                  ? "0.01"
                  : "1"
              }
              value={form[campo.nombre]}
              onChange={cambiar}
              required
            />
          </div>
        ))}

        {error && (
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </div>
        )}

        {categorias.length === 0 && (
          <div className="col-12">
            <div className="alert alert-warning">
              Crea una categoría primero.
            </div>
          </div>
        )}

        <div className="col-12 d-flex flex-wrap gap-2">
          <button
            type="submit"
            className="btn btn-sonido"
            disabled={categorias.length === 0}
          >
            Guardar producto
          </button>

          <Link
            to="/vendedor"
            className="btn btn-outline-secondary"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </>
  );
}

// ADMINISTRACIÓN DE CATEGORÍAS

export function AdminCategorias() {
  const {
    categorias,
    setCategorias,
    productos,
  } = useTienda();

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    imagen: "",
  });

  const [error, setError] = useState("");

  function limpiarFormulario() {
    setForm({
      nombre: "",
      descripcion: "",
      imagen: "",
    });
  }

  function guardar(evento) {
    evento.preventDefault();

    const nombre = form.nombre.trim();

    if (!nombre) {
      setError("Escribe un nombre.");
      return;
    }

    const duplicada = categorias.some(
      (categoria) =>
        categoria.id !== form.id &&
        categoria.nombre.toLowerCase() === nombre.toLowerCase(),
    );

    if (duplicada) {
      setError("Ya existe esa categoría.");
      return;
    }

    const categoria = {
      ...form,
      nombre,
      id: form.id || Date.now(),
    };

    if (form.id) {
      setCategorias(
        categorias.map((actual) =>
          actual.id === categoria.id
            ? categoria
            : actual,
        ),
      );
    } else {
      setCategorias([...categorias, categoria]);
    }

    limpiarFormulario();
    setError("");
  }

  function eliminar(categoria) {
    const tieneProductos = productos.some(
      (producto) => producto.categoriaId === categoria.id,
    );

    if (tieneProductos) {
      setError(
        "Reasigna o elimina los productos de esta categoría antes de eliminarla.",
      );
      return;
    }

    const confirmar = window.confirm(
      `¿Eliminar ${categoria.nombre}?`,
    );

    if (confirmar) {
      setCategorias(
        categorias.filter(
          (actual) => actual.id !== categoria.id,
        ),
      );

      if (form.id === categoria.id) {
        limpiarFormulario();
      }

      setError("");
    }
  }

  const campos = [
    {
      nombre: "nombre",
      etiqueta: "Nombre",
    },
    {
      nombre: "descripcion",
      etiqueta: "Descripción",
    },
    {
      nombre: "imagen",
      etiqueta: "Imagen (ruta o URL HTTPS)",
    },
  ];

  return (
    <>
      <h2 className="h4 mb-4">
        Administrar categorías
      </h2>

      <form className="row g-3 my-3" onSubmit={guardar}>
        {campos.map((campo) => (
          <div
            key={campo.nombre}
            className="col-12 col-md-6"
          >
            <label
              htmlFor={`categoria-${campo.nombre}`}
              className="form-label"
            >
              {campo.etiqueta}
            </label>

            <input
              id={`categoria-${campo.nombre}`}
              className="form-control"
              value={form[campo.nombre]}
              maxLength={
                campo.nombre === "nombre" ? 100 : 500
              }
              required={campo.nombre === "nombre"}
              pattern={
                campo.nombre === "imagen"
                  ? "(/[^ ].*|https://[^ ]+)"
                  : undefined
              }
              onChange={(evento) =>
                setForm({
                  ...form,
                  [campo.nombre]: evento.target.value,
                })
              }
            />
          </div>
        ))}

        <div className="col-12 d-flex flex-wrap gap-2">
          <button type="submit" className="btn btn-sonido">
            {form.id
              ? "Guardar cambios"
              : "Crear categoría"}
          </button>

          {form.id && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={limpiarFormulario}
            >
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="table-responsive my-4">
        <table className="table table-dark table-striped align-middle">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Descripción</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.nombre}</td>

                <td>{categoria.descripcion}</td>

                <td>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-info"
                      onClick={() => {
                        setForm(categoria);
                        setError("");
                      }}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => eliminar(categoria)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {categorias.length === 0 && (
        <div className="alert alert-info">
          No hay categorías registradas.
        </div>
      )}
    </>
  );
}