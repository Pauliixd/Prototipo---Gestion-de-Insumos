// bd.js
// BASE DE DATOS LOCAL
// Esta hoja se encarga de gestionar los datos de insumos, préstamos, usuarios y destinatarios
const CLAVE_INSUMOS = "insumos";
const CLAVE_PRESTAMOS = "prestamos";
const CLAVE_USUARIOS = "usuarios";
const CLAVE_DESTINATARIOS = "destinatarios";

// Guarda un array , lo convierte a texto (JSON)
export function guardarArray(array, clave) {
  const datosString = JSON.stringify(array); // convierte el array a formato texto
  localStorage.setItem(clave, datosString);   // guarda el texto con una clave específifica
  return true; //se guardó correctamente
}
//si no hay nada guardado devuelve un array vacio
function obtenerArray(clave) {
  const datos = JSON.parse(localStorage.getItem(clave));
  return datos ? datos : [];
}
// FUNCIÓN 1: CÓDIGO ALEATORIO (Para IDs de PRÉSTAMOS y Inicialización de Admin)
export function obtenerCodigo() {
  // Devuelve un número entero aleatorio entre 0 y 999999
  return Math.floor(Math.random() * 1000000); 
}

// FUNCIÓN 2: CÓDIGO INCREMENTAL (Solo para Insumos, Usuarios y Destinatarios)
export function obtenerSiguienteCodigo() {
    const insumos = obtenerInsumos(); 
    let maxCodigo = 0; // Inicializamos con 0

    // Busca el código más alto solo en la lista de INSUMOS (según tu requisito)
    for (let i = 0; i < insumos.length; i++) {
        const codigoActual = insumos[i].codigo; 
        if (codigoActual > maxCodigo) {
            maxCodigo = codigoActual;
        }
    }
    
    return maxCodigo + 1;
}

// Si no existen USUARIOS crea un usuario administrador por defecto
export function obtenerUsuarios() {
  let usuarios = obtenerArray(CLAVE_USUARIOS);
  if (usuarios.length === 0) {
    usuarios = [{
      codigo: obtenerCodigo(), // <-- Usa el código ALEATORIO para el admin inicial
      dni: "0000",
      nombreYApellido: "Administrador General",
      email: "admin@isft12.edu.ar",
      cargo: "Admin",
      passwordSystem: "admin",
      active: true,
    }];
    guardarArray(usuarios, CLAVE_USUARIOS);
  }
  return usuarios;
}
//Guarda un nuevo usuario en el sistema
export function guardarUsuario(usuario) {
  const usuarios = obtenerUsuarios();
  usuario.codigo = obtenerSiguienteCodigo(); // <-- Usa el INCREMENTAL
  usuarios.push(usuario);//agrega un nuevo usuario
  guardarArray(usuarios, CLAVE_USUARIOS);//guardo todo el array actualizado noma
  return usuario;
}
//Actualiza los datos de un usuario
export function actualizarUsuario(usuarioActualizado) {
  let usuarios = obtenerUsuarios();
  let index = -1;
  let i = 0;

  // Buscar el índice del usuario por su código
  while (index === -1 && i < usuarios.length) {
    if (usuarios[i].codigo == usuarioActualizado.codigo) {
      index = i;
    }
    i++;
  }
  // Si se encontró el usuario, actualizarlo
  if (index !== -1) {
    let usuario = usuarios[index];

    // Actualiza cada campo 
    if (usuarioActualizado.nombreYApellido !== undefined) {
      usuario.nombreYApellido = usuarioActualizado.nombreYApellido;
    }
    if (usuarioActualizado.email !== undefined) {
      usuario.email = usuarioActualizado.email;
    }
    if (usuarioActualizado.cargo !== undefined) {
      usuario.cargo = usuarioActualizado.cargo;
    }
    if (usuarioActualizado.passwordSystem !== undefined) {
      usuario.passwordSystem = usuarioActualizado.passwordSystem;
    }

    usuarios[index] = usuario; //reemplaza el usuario actualizado
    guardarArray(usuarios, CLAVE_USUARIOS);
    return true;
  }
  return false;
}
//elimina un usuario segun su codigo
export function eliminarUsuario(codigo) {
  let usuarios = obtenerUsuarios();
  const usuariosFiltrados = usuarios.filter(u => u.codigo != codigo);//este saca al usuario
  guardarArray(usuariosFiltrados, CLAVE_USUARIOS);
  return usuariosFiltrados.length !== usuarios.length;
}

// INSUMOS  si no hay, crea por defecto
export function obtenerInsumos() {
  let insumos = obtenerArray(CLAVE_INSUMOS);
  if (insumos.length === 0) {
    insumos = [
      { codigo: 10001, nombre: "Zapatilla", estado: "Disponible", observacion: "" },
      { codigo: 10002, nombre: "Zapatilla", estado: "Disponible", observacion: "" },
      { codigo: 10003, nombre: "Borrador", estado: "Fuera de Servicio", observacion: "Daño por calor" },
      { codigo: 10004, nombre: "Casco", estado: "Disponible", observacion: "" },
    ];
    guardarArray(insumos, CLAVE_INSUMOS);
  }
  return insumos;
}

export function guardarInsumo(insumo) {
  const insumos = obtenerInsumos();
  insumo.codigo = obtenerSiguienteCodigo(); // <-- Usa el INCREMENTAL
  insumos.push(insumo);
  guardarArray(insumos, CLAVE_INSUMOS);
  return insumo;
}

export function actualizarInsumo(insumoActualizado) {
  let insumos = obtenerInsumos();
  let index = -1;
  let i = 0;
  // Buscar el índice del insumo por su código
  while (index === -1 && i < insumos.length) {
    if (insumos[i].codigo == insumoActualizado.codigo) {
      index = i;
    }
    i++;
  }

  // Si se encontró el insumo, actualizar sus datos
  if (index !== -1) {
    let insumo = insumos[index];

    // si lo encunetra actualiza los campos
    if (insumoActualizado.nombre !== undefined) {
      insumo.nombre = insumoActualizado.nombre;
    }
    if (insumoActualizado.estado !== undefined) {
      insumo.estado = insumoActualizado.estado;
    }
    if (insumoActualizado.observacion !== undefined) {
      insumo.observacion = insumoActualizado.observacion;
    }

    insumos[index] = insumo;
    guardarArray(insumos, CLAVE_INSUMOS);//aca se encarga de guardar los cambios
    return true;
  }
  return false;
}
// y aca nuevamente se encarga de eliminar por codigo
export function eliminarInsumo(codigo) {
  let insumos = obtenerInsumos();
  const insumosFiltrados = insumos.filter(i => i.codigo != codigo);
  guardarArray(insumosFiltrados, CLAVE_INSUMOS);
  return insumosFiltrados.length !== insumos.length;
}

// PRÉSTAMOS
export function obtenerPrestamos() {
  let prestamos = obtenerArray(CLAVE_PRESTAMOS);
  if (prestamos.length === 0) {
    guardarArray([], CLAVE_PRESTAMOS);
    prestamos = [];
  }
  return prestamos;
}

export function guardarPrestamo(prestamo) {
  const prestamos = obtenerPrestamos();
  
  // 1. Asigna el ID de la TRANSACCIÓN (el ID ÚNICO interno)
  prestamo.idTransaccion = obtenerCodigo(); // <-- Usa el código ALEATORIO para ID INTERNO
  
  // 2. El campo prestamo.codigoInsumo YA CONTIENE el código del insumo físico
  
  prestamo.estado = prestamo.estado || "activo";
  prestamos.push(prestamo);
  guardarArray(prestamos, CLAVE_PRESTAMOS);
  return prestamo;
}

/** Actualiza el estado de un préstamo (activo|moroso|devuelto) */
export function actualizarEstadoPrestamo(idTransaccion, nuevoEstado) {
  const prestamos = obtenerPrestamos();
  // Busca por el ID de la transacción
  const index = prestamos.findIndex(p => p.idTransaccion == idTransaccion); 
  if (index !== -1) {
    prestamos[index].estado = nuevoEstado;
    guardarArray(prestamos, CLAVE_PRESTAMOS);
    return true;
  }
  return false;
}

/** Marca como devuelto y libera el insumo correspondiente */
export function marcarComoDevuelto(idTransaccion) {
  const prestamos = obtenerPrestamos();
  const insumos = obtenerInsumos();
  // Busca por el ID de la transacción
  const prestamo = prestamos.find(p => p.idTransaccion == idTransaccion); 
  if (!prestamo) return false;
  
  prestamo.estado = "devuelto";
  
  // Usa el código del insumo guardado en el préstamo para liberarlo.
  const insumo = insumos.find(i => i.codigo == prestamo.codigoInsumo); 
  
  if (insumo) insumo.estado = "Disponible";
  guardarArray(prestamos, CLAVE_PRESTAMOS);
  guardarArray(insumos, CLAVE_INSUMOS);
  return true;
}

/** Devuelve objetos por estado */
export function obtenerPrestamosPorEstado() {
  const prestamos = obtenerPrestamos();
  return {
    activos: prestamos.filter(p => p.estado === "activo"),
    morosos: prestamos.filter(p => p.estado === "moroso"),
    devueltos: prestamos.filter(p => p.estado === "devuelto"),
  };
}

/*Marca insumos como Prestado  */
export function actualizarInsumosPrestados(insumosPrestados) {
  let insumos = obtenerInsumos();

  // Recorremos cada insumo prestado
  for (let i = 0; i < insumosPrestados.length; i++) {
    let codigoPrestado = insumosPrestados[i].codigo;

    // Buscamos el insumo con ese código
    for (let j = 0; j < insumos.length; j++) {
      if (insumos[j].codigo == codigoPrestado) {
        insumos[j].estado = "Prestado";
      }
    }
  }
  guardarArray(insumos, CLAVE_INSUMOS);
}

// DESTINATARIOS
export function obtenerDestinatarios() {
  let destinatarios = obtenerArray(CLAVE_DESTINATARIOS);
  if (destinatarios.length === 0) {
    destinatarios = [{ codigo: obtenerCodigo(), nombreYApellido: "Sin asignar", cargo: "N/A" }]; // <-- Usa el código ALEATORIO
    guardarArray(destinatarios, CLAVE_DESTINATARIOS);
  }
  return destinatarios;
}
// Guarda un nuevo destinatario con código
export function guardarDestinatario(destinatario) {
  const destinatarios = obtenerDestinatarios();
  destinatario.codigo = obtenerSiguienteCodigo(); // <-- Usa el INCREMENTAL
  destinatarios.push(destinatario);
  guardarArray(destinatarios, CLAVE_DESTINATARIOS);
  return destinatario;
}