// funciones.js


export function crearTablaGeneral(datos, columnas, opciones) {
  const seleccionar = opciones && opciones.seleccionar ? true : false;
  const acciones = opciones && opciones.acciones ? opciones.acciones : null;

  const tabla = document.createElement("table");
  tabla.className = "table table-hover align-middle";

  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  const trHead = document.createElement("tr");

  if (seleccionar) {
    const thSel = document.createElement("th");
    thSel.textContent = "Seleccionar";
    trHead.appendChild(thSel);
  }

  for (let i = 0; i < columnas.length; i++) {
    const th = document.createElement("th");
    th.textContent = columnas[i].texto;
    trHead.appendChild(th);
  }

  if (acciones) {
    const thAcc = document.createElement("th");
    thAcc.textContent = "Acciones";
    trHead.appendChild(thAcc);
  }

  thead.appendChild(trHead);

  for (let i = 0; i < datos.length; i++) {
    const item = datos[i];
    const tr = document.createElement("tr");

    if (seleccionar) {
      const tdSel = document.createElement("td");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      tdSel.appendChild(checkbox);
      tr.appendChild(tdSel);
    }

    for (let j = 0; j < columnas.length; j++) {
      const col = columnas[j];
      const td = document.createElement("td");
      if (item[col.clave]) {
        td.textContent = item[col.clave];
      } else {
        td.textContent = "";
      }
      tr.appendChild(td);
    }

    if (acciones) {
      const tdAcc = document.createElement("td");
      const nodoAccion = acciones(item);
      tdAcc.appendChild(nodoAccion);
      tr.appendChild(tdAcc);
    }

    tbody.appendChild(tr);
  }

  tabla.appendChild(thead);
  tabla.appendChild(tbody);

  return tabla;
}

// -----------------------------------------------------------------------

export function buscarInsumo(insumos, valor) {
  const texto = valor.trim().toLowerCase();
  if (texto === "") {
    return insumos;
  }

  const resultado = [];

  for (let i = 0; i < insumos.length; i++) {
    const insumo = insumos[i];
    let nombre = "";
    if (insumo.nombre) {
      nombre = insumo.nombre.toLowerCase();
    }

    if (nombre.includes(texto)) {
      resultado.push(insumo);
    }
  }

  return resultado;
}

// -----------------------------------------------------------------------

export function filtrarTabla(insumos, texto) {
  const termino = texto.toLowerCase();
  const filtrados = [];

  for (let i = 0; i < insumos.length; i++) {
    const insumo = insumos[i];

    let nombre = "";
    let categoria = "";
    let estado = "";

    if (insumo.nombre) {
      nombre = insumo.nombre.toLowerCase();
    }
    if (insumo.categoria) {
      categoria = insumo.categoria.toLowerCase();
    }
    if (insumo.estado) {
      estado = insumo.estado.toLowerCase();
    }

    if (
      nombre.includes(termino) ||
      categoria.includes(termino) ||
      estado.includes(termino)
    ) {
      filtrados.push(insumo);
    }
  }

  return filtrados;
}
