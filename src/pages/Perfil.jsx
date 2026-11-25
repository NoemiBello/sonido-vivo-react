import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  actualizarUsuario,
  buscarUsuarioPorCorreo,
  crearUsuario,
} from "../services/usuariosService";
import { listarSolicitudesPorCorreo } from "../services/serviciosTecnicosService";
import { cerrarSesion, leerSesion } from "../utils/storage";
import { nombreRol } from "../utils/roles";

const fichaVacia = {
  id: null,
  nombre: "",
  apellido: "",
  telefono: "",
  direccion: "",
};

export default function Perfil() {
  const navigate = useNavigate();
  const sesion = leerSesion();
  const correo = sesion?.correo;

  const [ficha, setFicha] = useState(fichaVacia);
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [errorSolicitudes, setErrorSolicitudes] = useState("");

  useEffect(() => {
    async function cargarFicha() {
      try {
        const datos = await buscarUsuarioPorCorreo(correo);

        if (datos) {
          setFicha({
            ...datos,
            telefono: datos.telefono ?? "",
            direccion: datos.direccion ?? "",
          });
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    }

    async function cargarSolicitudes() {
      try {
        setSolicitudes(await listarSolicitudesPorCorreo(correo));
      } catch (e) {
        setErrorSolicitudes(e.message);
      }
    }

    cargarFicha();
    cargarSolicitudes();
  }, [correo]);

  function cambiar(evento) {
    const { name, value } = evento.target;
    setFicha({ ...ficha, [name]: value });
  }

  async function guardar(evento) {
    evento.preventDefault();
    setMensaje("");
    setError("");

    if (!ficha.nombre.trim() || !ficha.apellido.trim()) {
      setError("Ingresa tu nombre y apellido.");
      return;
    }

    const datos = {
      correo,
      nombre: ficha.nombre.trim(),
      apellido: ficha.apellido.trim(),
      telefono: ficha.telefono.trim(),
      direccion: ficha.direccion.trim(),
    };

    setGuardando(true);

    try {
      const guardada = ficha.id
        ? await actualizarUsuario(ficha.id, datos)
        : await crearUsuario(datos);

      setFicha(guardada);
      setMensaje("Datos guardados.");
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  }

  function salir() {
    cerrarSesion();
    navigate("/login");
  }

  // Si la API rechazó el token, la sesión ya se cerró: se vuelve al login.
  if (!sesion) {
    return <Navigate to="/login" replace />;
  }

  if (cargando) {
    return <p className="container py-5">Cargando perfil...</p>;
  }

  return (
    <section className="container py-5">
      <p className="text-uppercase text-info fw-semibold mb-2">Mi cuenta</p>
      <h1>Perfil de usuario</h1>

      <div className="card bg-dark text-light border-secondary mt-4">
        <div className="card-body">
          <p><strong>Correo:</strong> {correo}</p>
          <p><strong>Rol:</strong> {nombreRol(sesion.rol)}</p>

          <form className="row g-3 mb-4" onSubmit={guardar} noValidate>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="perfil-nombre">Nombre</label>
              <input className="form-control" id="perfil-nombre" name="nombre" maxLength={80} value={ficha.nombre} onChange={cambiar} />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="perfil-apellido">Apellido</label>
              <input className="form-control" id="perfil-apellido" name="apellido" maxLength={80} value={ficha.apellido} onChange={cambiar} />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="perfil-telefono">Teléfono</label>
              <input className="form-control" id="perfil-telefono" name="telefono" maxLength={15} value={ficha.telefono} onChange={cambiar} />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="perfil-direccion">Dirección</label>
              <input className="form-control" id="perfil-direccion" name="direccion" maxLength={200} value={ficha.direccion} onChange={cambiar} />
            </div>

            {error && <p className="text-danger mb-0" role="alert">{error}</p>}
            {mensaje && <p className="text-info mb-0" role="status">{mensaje}</p>}

            <div className="col-12">
              <button className="btn btn-info" type="submit" disabled={guardando}>
                {guardando ? "Guardando..." : "Guardar datos"}
              </button>
            </div>
          </form>

          <div className="d-flex flex-wrap gap-2">
            <Link className="btn btn-outline-info" to="/historial">Ver historial de compras</Link>

            {sesion.rol === "ADMIN" && (
              <Link className="btn btn-info" to="/admin">Ir al panel administrativo</Link>
            )}

            <button className="btn btn-outline-light" type="button" onClick={salir}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      <h2 className="h4 mt-5">Mis solicitudes de servicio técnico</h2>

      {errorSolicitudes && (
        <p className="alert alert-danger" role="alert">{errorSolicitudes}</p>
      )}

      {!errorSolicitudes && solicitudes.length === 0 && (
        <p>No tienes solicitudes registradas.</p>
      )}

      {solicitudes.length > 0 && (
        <ul className="list-group mt-3">
          {solicitudes.map((solicitud) => (
            <li
              className="list-group-item bg-dark text-light border-secondary d-flex flex-wrap justify-content-between gap-2"
              key={solicitud.id}
            >
              <span>
                N° {solicitud.id} · {solicitud.instrumento} · {solicitud.fechaSolicitud}
              </span>
              <span className="badge text-bg-info">{solicitud.estado}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
