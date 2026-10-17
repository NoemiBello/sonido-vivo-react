const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarServicio(datos) {
  const errores = {};

  if (datos.nombre.trim().length < 3) {
    errores.nombre =
      "Ingresa un nombre de al menos 3 caracteres.";
  }

  if (
    !correoValido.test(
      datos.correo.trim(),
    )
  ) {
    errores.correo =
      "Ingresa un correo válido.";
  }

  if (
    !/^[0-9]{9}$/.test(
      datos.telefono.trim(),
    )
  ) {
    errores.telefono =
      "El teléfono debe tener 9 números.";
  }

  if (!datos.instrumento) {
    errores.instrumento =
      "Selecciona un instrumento.";
  }

  if (
    datos.descripcion.trim()
      .length < 20
  ) {
    errores.descripcion =
      "Describe el problema usando al menos 20 caracteres.";
  }

  if (
    !datos.aceptaCondiciones
  ) {
    errores.aceptaCondiciones =
      "Debes confirmar que los datos son ficticios.";
  }

  return errores;
}

export function validarContacto(
  datos,
) {
  const errores = {};

  if (
    datos.nombre.trim()
      .length < 3
  ) {
    errores.nombre =
      "Ingresa un nombre de al menos 3 caracteres.";
  }

  if (
    !correoValido.test(
      datos.correo.trim(),
    )
  ) {
    errores.correo =
      "Ingresa un correo válido.";
  }

  if (
    datos.asunto.trim()
      .length < 4
  ) {
    errores.asunto =
      "Ingresa un asunto.";
  }

  if (
    datos.mensaje.trim()
      .length < 10
  ) {
    errores.mensaje =
      "El mensaje debe tener al menos 10 caracteres.";
  }

  return errores;
}

export function validarRegistro(
  datos,
  usuarios = [],
) {
  const errores = {};

  if (
    datos.nombre.trim()
      .length < 3
  ) {
    errores.nombre =
      "El nombre debe tener al menos 3 caracteres.";
  }

  if (
    datos.apellido.trim()
      .length < 2
  ) {
    errores.apellido =
      "Ingresa un apellido válido.";
  }

  if (
    !correoValido.test(
      datos.correo.trim(),
    )
  ) {
    errores.correo =
      "Ingresa un correo válido.";
  }

  const correoRepetido =
    usuarios.some(
      (usuario) =>
        usuario.correo.toLowerCase() ===
        datos.correo
          .trim()
          .toLowerCase(),
    );

  if (correoRepetido) {
    errores.correo =
      "Ya existe un usuario con ese correo.";
  }

  if (
    datos.password.length < 6
  ) {
    errores.password =
      "La contraseña debe tener al menos 6 caracteres.";
  }

  if (
    datos.password !==
    datos.confirmarPassword
  ) {
    errores.confirmarPassword =
      "Las contraseñas no coinciden.";
  }

  return errores;
}

export function validarLogin(
  datos,
) {
  const errores = {};

  const correo =
    datos.correo.trim();

  if (!correo) {
    errores.correo =
      "Ingresa tu correo.";
  } else if (
    !correoValido.test(correo)
  ) {
    errores.correo =
      "Ingresa un correo válido.";
  }

  if (!datos.password) {
    errores.password =
      "Ingresa tu contraseña.";
  } else if (
    datos.password.length < 6
  ) {
    errores.password =
      "La contraseña debe tener al menos 6 caracteres.";
  }

  return errores;
}