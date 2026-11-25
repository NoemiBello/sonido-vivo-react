import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  actualizarCuenta,
  crearCuenta,
  desactivarCuenta,
  listarCuentas,
} from "../../services/authService";
import {
  actualizarUsuario,
  crearUsuario,
  listarUsuarios,
} from "../../services/usuariosService";
import { leerSesion } from "../../utils/storage";
import { nombreRol } from "../../utils/roles";

const formularioInicial = {
  id: null,
  fichaId: null,
  nombre: "",
  apellido: "",
  correo: "",
  password: "",
  telefono: "",
  direccion: "",
  rol: "USER",
  activo: true,
};

// authservice guarda la cuenta (correo, rol, activo) y usuariosservice los
// datos personales. Se unen por el correo, que es el dato en común.
async function cargarUsuarios() {
  const cuentas = await listarCuentas();
  const fichas = await listarUsuarios();

  return cuentas.map((cuenta) => {
    const ficha = fichas.find((item) => item.correo === cuenta.correo);

    return {
      ...cuenta,
      fichaId: ficha?.id ?? null,
      nombre: ficha?.nombre ?? "",
      apellido: ficha?.apellido ?? "",
      telefono: ficha?.telefono ?? "",
      direccion: ficha?.direccion ?? "",
    };
  });
}

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const sesion = leerSesion();

  useEffect(() => {
    async function cargar() {
      try {
        setUsuarios(await cargarUsuarios());
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    }

    cargar();
  }, []);

  function cambiar(evento) {
    const { name, value, type, checked } = evento.target;
    setFormulario({
      ...formulario,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function guardar(evento) {
    evento.preventDefault();

    const correo = formulario.correo.trim().toLowerCase();

    if (!formulario.nombre.trim() || !formulario.apellido.trim() || !correo) {
      setError("Completa los datos obligatorios.");
      return;
    }

    if (!formulario.id && formulario.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    const ficha = {
      correo,
      nombre: formulario.nombre.trim(),
      apellido: formulario.apellido.trim(),
      telefono: formulario.telefono.trim(),
      direccion: formulario.direccion.trim(),
    };

    setGuardando(true);
    setError("");

    try {
      if (formulario.id) {
        await actualizarCuenta(formulario.id, {
          rol: formulario.rol,
          activo: formulario.activo,
        });
      } else {
        await crearCuenta({
          correo,
          password: formulario.password,
          rol: formulario.rol,
        });
      }

      if (formulario.fichaId) {
        await actualizarUsuario(formulario.fichaId, ficha);
      } else {
        await crearUsuario(ficha);
      }

      setFormulario(formularioInicial);
      setUsuarios(await cargarUsuarios());
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  }

  async function desactivar(usuario) {
    if (!window.confirm(`¿Desactivar la cuenta ${usuario.correo}?`)) {
      return;
    }

    setError("");

    try {
      await desactivarCuenta(usuario.id);

      setUsuarios(
        usuarios.map((item) =>
          item.id === usuario.id ? { ...item, activo: false } : item,
        ),
      );
    } catch (e) {
      setError(e.message);
    }
  }

  function editar(usuario) {
    setFormulario({ ...formularioInicial, ...usuario });
    setError("");
  }

  // Si la API rechazó el token, la sesión ya se cerró: se vuelve al login.
  if (!sesion) {
    return <Navigate to="/login" replace />;
  }

  if (cargando) {
    return <p>Cargando usuarios...</p>;
  }

  return (
    <>
      <h2 className="h3">Administrar usuarios</h2>

      <form className="row g-3 my-3" onSubmit={guardar} data-testid="form-usuarios" noValidate>
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="admin-nombre">Nombre</label>
          <input className="form-control" id="admin-nombre" name="nombre" maxLength={80} value={formulario.nombre} onChange={cambiar} />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="admin-apellido">Apellido</label>
          <input className="form-control" id="admin-apellido" name="apellido" maxLength={80} value={formulario.apellido} onChange={cambiar} />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="admin-correo">Correo</label>
          {/* El correo une la cuenta con sus datos: no se cambia al editar */}
          <input className="form-control" id="admin-correo" name="correo" type="email" maxLength={100} value={formulario.correo} onChange={cambiar} disabled={Boolean(formulario.id)} />
        </div>

        {!formulario.id && (
          <div className="col-12 col-md-6">
            <label className="form-label" htmlFor="admin-password">Contraseña</label>
            <input className="form-control" id="admin-password" name="password" type="password" value={formulario.password} onChange={cambiar} />
          </div>
        )}

        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="admin-rol">Rol</label>
          <select className="form-select" id="admin-rol" name="rol" value={formulario.rol} onChange={cambiar}>
            <option value="USER">Cliente</option>
            <option value="VENDEDOR">Vendedor</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="admin-telefono">Teléfono</label>
          <input className="form-control" id="admin-telefono" name="telefono" maxLength={15} value={formulario.telefono} onChange={cambiar} />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="admin-direccion">Dirección</label>
          <input className="form-control" id="admin-direccion" name="direccion" maxLength={200} value={formulario.direccion} onChange={cambiar} />
        </div>

        {formulario.id && (
          <div className="col-12">
            <label className="form-check">
              <input className="form-check-input" name="activo" type="checkbox" checked={formulario.activo} onChange={cambiar} />
              <span className="form-check-label">Usuario activo</span>
            </label>
          </div>
        )}

        <p className="text-danger" role="alert">{error}</p>

        <div className="col-12 d-flex gap-2">
          <button className="btn btn-info" type="submit" disabled={guardando}>
            {formulario.id ? "Guardar cambios" : "Crear usuario"}
          </button>

          {formulario.id && (
            <button className="btn btn-outline-light" type="button" onClick={() => setFormulario(formularioInicial)}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-dark table-striped align-middle">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nombre} {usuario.apellido}</td>
                <td>{usuario.correo}</td>
                <td>{nombreRol(usuario.rol)}</td>
                <td>{usuario.activo ? "Activo" : "Inactivo"}</td>
                <td>
                  <div className="d-flex flex-wrap gap-2">
                    <button className="btn btn-sm btn-outline-info" type="button" onClick={() => editar(usuario)}>
                      Editar
                    </button>

                    {/* Un administrador no puede desactivar su propia cuenta */}
                    {usuario.activo && usuario.correo !== sesion.correo && (
                      <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => desactivar(usuario)}>
                        Desactivar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
