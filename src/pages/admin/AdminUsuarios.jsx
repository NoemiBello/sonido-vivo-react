import { useState } from "react";
import { guardarUsuarios, leerUsuarios } from "../../utils/storage";

const formularioInicial = {
  id: null,
  nombre: "",
  apellido: "",
  correo: "",
  password: "123456",
  rol: "cliente",
  activo: true,
};

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState(() => leerUsuarios());
  const [formulario, setFormulario] = useState(formularioInicial);
  const [error, setError] = useState("");

  function cambiar(evento) {
    const { name, value, type, checked } = evento.target;
    setFormulario({
      ...formulario,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function guardar(evento) {
    evento.preventDefault();

    const correo = formulario.correo.trim().toLowerCase();

    if (!formulario.nombre.trim() || !formulario.apellido.trim() || !correo) {
      setError("Completa los datos obligatorios.");
      return;
    }

    const correoRepetido = usuarios.some(
      (usuario) =>
        usuario.id !== formulario.id &&
        usuario.correo.toLowerCase() === correo,
    );

    if (correoRepetido) {
      setError("Ya existe un usuario con ese correo.");
      return;
    }

    const usuario = {
      ...formulario,
      id: formulario.id || Date.now(),
      nombre: formulario.nombre.trim(),
      apellido: formulario.apellido.trim(),
      correo,
    };

    const nuevaLista = formulario.id
      ? usuarios.map((item) => item.id === usuario.id ? usuario : item)
      : [...usuarios, usuario];

    setUsuarios(nuevaLista);
    guardarUsuarios(nuevaLista);
    setFormulario(formularioInicial);
    setError("");
  }

  function editar(usuario) {
    setFormulario(usuario);
    setError("");
  }

  return (
    <>
      <h2 className="h3">Administrar usuarios</h2>

      <form className="row g-3 my-3" onSubmit={guardar} data-testid="form-usuarios">
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="admin-nombre">Nombre</label>
          <input className="form-control" id="admin-nombre" name="nombre" value={formulario.nombre} onChange={cambiar} />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="admin-apellido">Apellido</label>
          <input className="form-control" id="admin-apellido" name="apellido" value={formulario.apellido} onChange={cambiar} />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="admin-correo">Correo</label>
          <input className="form-control" id="admin-correo" name="correo" type="email" value={formulario.correo} onChange={cambiar} />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="admin-rol">Rol</label>
          <select className="form-select" id="admin-rol" name="rol" value={formulario.rol} onChange={cambiar}>
            <option value="cliente">Cliente</option>
            <option value="vendedor">Vendedor</option>
            <option value="administrador">Administrador</option>
          </select>
        </div>

        <div className="col-12">
          <label className="form-check">
            <input className="form-check-input" name="activo" type="checkbox" checked={formulario.activo} onChange={cambiar} />
            <span className="form-check-label">Usuario activo</span>
          </label>
        </div>

        <p className="text-danger" role="alert">{error}</p>

        <div className="col-12 d-flex gap-2">
          <button className="btn btn-info" type="submit">
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
                <td>{usuario.rol}</td>
                <td>{usuario.activo ? "Activo" : "Inactivo"}</td>
                <td>
                  <button className="btn btn-sm btn-outline-info" type="button" onClick={() => editar(usuario)}>
                    Editar
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
