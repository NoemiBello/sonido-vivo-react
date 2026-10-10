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
    <section className="sv-pagina">
      <h1>Acceso del vendedor</h1>

      <p>
        Acceso de demostración para la evaluación.
        No verifica credenciales en un servidor.
      </p>

      <form className="sv-form" onSubmit={entrar}>
        <label>
          Correo
          <input
            name="correo"
            type="email"
            required
          />
        </label>

        <label>
          Contraseña de demostración
          <input
            type="password"
            minLength={4}
            maxLength={10}
            required
          />
        </label>

        <button className="boton">
          Ingresar
        </button>
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
    <section className="sv-pagina">
      <p className="etiqueta">ADMINISTRACIÓN</p>
      <h1>Panel del vendedor</h1>

      <p>{localStorage.getItem("correoUsuario")}</p>

      <nav className="sv-tabs">
        <NavLink end to="/vendedor">
          Productos
        </NavLink>

        <NavLink to="/vendedor/categorias">
          Categorías
        </NavLink>

        <NavLink to="/vendedor/stock-critico">
          Stock crítico
        </NavLink>

        <button onClick={salir}>
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
      <div className="sv-resumen">
        <article>
          <strong>{productos.length}</strong>
          Productos
        </article>

        <article>
          <strong>
            {productos.reduce(
              (total, producto) => total + producto.stock,
              0,
            )}
          </strong>
          Unidades en stock
        </article>

        <article>
          <strong>
            {productos.filter(esCritico).length}
          </strong>
          Stock crítico
        </article>
      </div>

      <div className="sv-toolbar">
        <h2>
          {criticos
            ? "Productos con stock crítico"
            : "Administrar productos"}
        </h2>

        <Link
          className="boton"
          to="/vendedor/productos/nuevo"
        >
          Crear producto
        </Link>
      </div>

      <label>
        Buscar producto
        <input
          type="search"
          value={busqueda}
          onChange={(evento) =>
            setBusqueda(evento.target.value)
          }
        />
      </label>

      <div className="sv-tabla">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio base</th>
              <th>Stock / mínimo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {lista.map((producto) => (
              <tr key={producto.id}>
                <td>
                  {producto.nombre}
                  <small>{producto.codigo}</small>
                </td>

                <td>
                  {
                    categorias.find(
                      (categoria) =>
                        categoria.id === producto.categoriaId,
                    )?.nombre
                  }
                </td>

                <td>{moneda(producto.precio)}</td>

                <td>
                  {producto.stock} / {producto.stockCritico}
                </td>

                <td>
                  {producto.stock === 0
                    ? "Sin stock"
                    : esCritico(producto)
                      ? "Stock crítico"
                      : "Disponible"}
                </td>

                <td>
                  <Link
                    to={`/vendedor/productos/${producto.id}/editar`}
                  >
                    Editar / stock
                  </Link>

                  <button
                    onClick={() => eliminar(producto)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {lista.length === 0 && (
        <p className="sv-vacio">
          No hay productos para mostrar.
        </p>
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
      <p>
        Producto no encontrado.{" "}
        <Link to="/vendedor">Volver</Link>
      </p>
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
    { nombre: "precio", etiqueta: "Precio base ($)" },
    { nombre: "stock", etiqueta: "Stock disponible" },
    {
      nombre: "stockCritico",
      etiqueta: "Umbral de stock crítico",
    },
    { nombre: "descuento", etiqueta: "Descuento (%)" },
  ];

  return (
    <>
      <h2>
        {existente
          ? "Editar producto y stock"
          : "Crear producto"}
      </h2>

      <form className="sv-form" onSubmit={guardar}>
        <label>
          Código
          <input
            name="codigo"
            value={form.codigo}
            onChange={cambiar}
            minLength={3}
            required
          />
        </label>

        <label>
          Nombre
          <input
            name="nombre"
            value={form.nombre}
            onChange={cambiar}
            maxLength={100}
            required
          />
        </label>

        <label>
          Descripción
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={cambiar}
            maxLength={500}
          />
        </label>

        <label>
          Categoría
          <select
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
        </label>

        {camposNumericos.map((campo) => (
          <label key={campo.nombre}>
            {campo.etiqueta}

            <input
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
          </label>
        ))}

        <label>
          Imagen (ruta /img/... o URL HTTPS)
          <input
            name="imagen"
            value={form.imagen}
            onChange={cambiar}
            pattern="(/[^ ].*|https://[^ ]+)"
            placeholder="/img/guitarra-schecter.jpg"
          />
        </label>

        <p role="alert">{error}</p>

        <button
          className="boton"
          disabled={categorias.length === 0}
        >
          Guardar producto
        </button>

        <Link to="/vendedor">Cancelar</Link>

        {categorias.length === 0 && (
          <p>Crea una categoría primero.</p>
        )}
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
    { nombre: "nombre", etiqueta: "Nombre" },
    { nombre: "descripcion", etiqueta: "Descripción" },
    {
      nombre: "imagen",
      etiqueta: "Imagen (ruta o URL HTTPS)",
    },
  ];

  return (
    <>
      <h2>Administrar categorías</h2>

      <form className="sv-form" onSubmit={guardar}>
        {campos.map((campo) => (
          <label key={campo.nombre}>
            {campo.etiqueta}

            <input
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
          </label>
        ))}

        <button className="boton">
          {form.id
            ? "Guardar cambios"
            : "Crear categoría"}
        </button>

        {form.id && (
          <button
            type="button"
            onClick={limpiarFormulario}
          >
            Cancelar edición
          </button>
        )}
      </form>

      <p role="alert">{error}</p>

      <div className="sv-tabla">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.nombre}</td>
                <td>{categoria.descripcion}</td>

                <td>
                  <button
                    onClick={() => {
                      setForm(categoria);
                      setError("");
                    }}
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => eliminar(categoria)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}