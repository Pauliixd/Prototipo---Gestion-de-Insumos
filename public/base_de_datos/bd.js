// bd.js
// BASE DE DATOS LOCAL

const CLAVE_INSUMOS = "insumos";
const CLAVE_PRESTAMOS = "prestamos";
const CLAVE_USUARIOS = "usuarios";
const CLAVE_DESTINATARIOS = "destinatarios";

function guardarArray(array, clave) {
  try {
    const datosString = JSON.stringify(array);
    localStorage.setItem(clave, datosString);
    return true;
  } catch (error) {
    console.error("Error al guardar en localStorage:", error);
    return false;
  }
}

function obtenerArray(clave) {
  const datos = JSON.parse(localStorage.getItem(clave));
  return datos ? datos : [];
}

// FUNCIÓN 1: CÓDIGO ALEATORIO (Para IDs de PRÉSTAMOS y Inicialización de Admin)
export function obtenerCodigo() {
  // Genera un ID de transacción aleatorio y único (para la gestión del préstamo)
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

// USUARIOS
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

export function guardarUsuario(usuario) {
  const usuarios = obtenerUsuarios();
  usuario.codigo = obtenerSiguienteCodigo(); // <-- Usa el INCREMENTAL
  usuarios.push(usuario);
  guardarArray(usuarios, CLAVE_USUARIOS);
  return usuario;
}

export function actualizarUsuario(usuarioActualizado) {
  let usuarios = obtenerUsuarios();
  const index = usuarios.findIndex(u => u.codigo == usuarioActualizado.codigo);
  if (index !== -1) {
    usuarios[index] = { ...usuarios[index], ...usuarioActualizado };
    guardarArray(usuarios, CLAVE_USUARIOS);
    return true;
  }
  return false;
}

export function eliminarUsuario(codigo) {
  let usuarios = obtenerUsuarios();
  const usuariosFiltrados = usuarios.filter(u => u.codigo != codigo);
  guardarArray(usuariosFiltrados, CLAVE_USUARIOS);
  return usuariosFiltrados.length !== usuarios.length;
}

// INSUMOS
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
  const index = insumos.findIndex(i => i.codigo == insumoActualizado.codigo);
  if (index !== -1) {
    insumos[index] = { ...insumos[index], ...insumoActualizado };
    guardarArray(insumos, CLAVE_INSUMOS);
    return true;
  }
  return false;
}

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

/** Marca insumos como Prestado (igual que tenías) */
export function actualizarInsumosPrestados(insumosPrestados) {
  let insumos = obtenerInsumos();
  insumosPrestados.forEach(prestado => {
    const encontrado = insumos.find(i => i.codigo == prestado.codigo);
    if (encontrado) encontrado.estado = "Prestado";
  });
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

export function guardarDestinatario(destinatario) {
  const destinatarios = obtenerDestinatarios();
  destinatario.codigo = obtenerSiguienteCodigo(); // <-- Usa el INCREMENTAL
  destinatarios.push(destinatario);
  guardarArray(destinatarios, CLAVE_DESTINATARIOS);
  return destinatario;
}