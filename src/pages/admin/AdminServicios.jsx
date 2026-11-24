import { useEffect, useState } from "react";
import {
  cambiarEstadoSolicitud,
  eliminarSolicitud,
  listarSolicitudes,
} from "../../services/serviciosTecnicosService";

// Mismo orden que valida el backend: el estado avanza de a un paso.
const ESTADOS = [
  "PENDIENTE",
  "EN_REVISION",
  "EN_REPARACION",
  "LISTO",
  "ENTREGADO",
];

export default function AdminServicios() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargar() {
      try {
        setSolicitudes(await listarSolicitudes());
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    }

    cargar();
  }, []);

  async function avanzar(solicitud, estado) {
    setError("");

    try {
      const actualizada = await cambiarEstadoSolicitud(solicitud.id, estado);

      setSolicitudes(
        solicitudes.map((item) =>
          item.id === actualizada.id ? actualizada : item,
        ),
      );
    } catch (e) {
      setError(e.message);
    }
  }

  async function eliminar(solicitud) {
    if (!window.confirm(`¿Eliminar la solicitud N° ${solicitud.id}?`)) {
      return;
    }

    setError("");

    try {
      await eliminarSolicitud(solicitud.id);
      setSolicitudes(solicitudes.filter((item) => item.id !== solicitud.id));
    } catch (e) {
      setError(e.message);
    }
  }

  if (cargando) {
    return <p>Cargando solicitudes...</p>;
  }

  return (
    <>
      <h2 className="h3">Solicitudes de servicio técnico</h2>

      {error && <p className="alert alert-danger" role="alert">{error}</p>}

      {solicitudes.length === 0 ? (
        <p>No hay solicitudes registradas.</p>
      ) : (
        <div className="table-responsive mt-4">
          <table className="table table-dark table-striped align-middle">
            <thead>
              <tr>
                <th>N°</th>
                <th>Cliente</th>
                <th>Instrumento</th>
                <th>Problema</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.map((solicitud) => {
                const siguiente =
                  ESTADOS[ESTADOS.indexOf(solicitud.estado) + 1];

                return (
                  <tr key={solicitud.id}>
                    <td>{solicitud.id}</td>
                    <td>
                      {solicitud.nombre}
                      <small className="d-block text-secondary">
                        {solicitud.correo} · {solicitud.telefono}
                      </small>
                    </td>
                    <td>{solicitud.instrumento}</td>
                    <td>{solicitud.descripcion}</td>
                    <td className="text-nowrap">{solicitud.fechaSolicitud}</td>
                    <td>{solicitud.estado}</td>
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        {siguiente && (
                          <button
                            className="btn btn-sm btn-outline-info"
                            type="button"
                            onClick={() => avanzar(solicitud, siguiente)}
                          >
                            Pasar a {siguiente}
                          </button>
                        )}

                        <button
                          className="btn btn-sm btn-outline-danger"
                          type="button"
                          onClick={() => eliminar(solicitud)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
