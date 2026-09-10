/**
 * CATALOGO MASTER DE ACTAS PNP (14 ACTAS OFICIALES + SOPORTE MANUAL Y MULTI-VEHÍCULO)
 * Sistema de Gestión e Individualización de Expedientes Policiales
 */

const CATALOGO_ACTAS = [
  { 
    id: "intervencion", 
    aliases: ["intervencion", "acta_intervencion", "01_ACTA_DE_INTERVENCION_POLICIAL"], 
    titulo: "01. Acta de Intervención Policial", 
    archivo: "plantillas/acta_intervencion.docx", 
    llevaHora: true, 
    esIndividual: false // ÚNICA Y COLECTIVA PARA TODOS
  },
  { 
    id: "reg_personal", 
    aliases: ["reg_personal", "acta_registro_personal", "registro_personal", "ACTA_DE_REGISTRO_PERSONAL"], 
    titulo: "02. Acta de Registro Personal e Incautación", 
    archivo: "plantillas/acta_registro_personal.docx", 
    llevaHora: true, 
    esIndividual: true // INDIVIDUAL POR DETENIDO
  },
  { 
    id: "lectura_derechos", 
    aliases: ["lectura_derechos", "acta_lectura_derechos", "ACTA_DE_LECTURA_DE_DERECHOS"], 
    titulo: "03. Acta de Lectura de Derechos", 
    archivo: "plantillas/acta_lectura_derechos.docx", 
    llevaHora: true, 
    esIndividual: true // INDIVIDUAL POR DETENIDO
  },
  { 
    id: "detencion", 
    aliases: ["detencion", "acta_detencion", "ACTA_DE_DETENCION_POLICIAL"], 
    titulo: "04. Acta de Detención Policial", 
    archivo: "plantillas/acta_detencion.docx", 
    llevaHora: true, 
    esIndividual: true // INDIVIDUAL POR DETENIDO
  },
  { 
    id: "buen_trato", 
    aliases: ["buen_trato", "constancia_buen_trato", "buentrato", "acta_buen_trato", "CONSTANCIA_DE_BUEN_TRATO"], 
    titulo: "05. Constancia de Buen Trato e Integridad Física", 
    archivo: "plantillas/acta_buen_trato.docx", 
    llevaHora: false, 
    esIndividual: true // INDIVIDUAL POR DETENIDO
  },
  { 
    id: "sit_vehicular", 
    aliases: ["sit_vehicular", "acta_situacion_vehicular", "situacion_vehicular", "ACTA_DE_SITUACION_VEHICULAR"], 
    titulo: "06. Acta de Situación Vehicular", 
    archivo: "plantillas/acta_situacion_vehicular.docx", 
    llevaHora: true, 
    esIndividual: true,
    esVehicular: true // INDIVIDUAL POR VEHÍCULO / PLACA
  },
  { 
    id: "reg_vehicular", 
    aliases: ["reg_vehicular", "acta_registro_vehicular", "registro_vehicular", "ACTA_DE_REGISTRO_VEHICULAR"], 
    titulo: "07. Acta de Registro Vehicular", 
    archivo: "plantillas/acta_registro_vehicular.docx", 
    llevaHora: true, 
    esIndividual: true,
    esVehicular: true // INDIVIDUAL POR VEHÍCULO / PLACA
  },
  { 
    id: "lacrado", 
    aliases: ["lacrado", "acta_lacrado", "ACTA_DE_LACRADO_CADENA_CUSTODIA"], 
    titulo: "08. Acta de Lacrado / Cadena de Custodia", 
    archivo: "plantillas/acta_lacrado.docx", 
    llevaHora: true, 
    esIndividual: true 
  },
  { 
    id: "comunicacion", 
    aliases: ["comunicacion", "comunicacion_fiscal", "acta_comunicacion", "ACTA_DE_COMUNICACION_AL_RMP"], 
    titulo: "09. Acta de Comunicación Telefónica al RMP", 
    archivo: "plantillas/acta_comunicacion.docx", 
    llevaHora: true, 
    esIndividual: true 
  },
  { 
    id: "notif_detencion", 
    aliases: ["notif_detencion", "acta_notificacion_familiar", "ACTA_NOTIFICACION_DETENCION_FAMILIAR"], 
    titulo: "10. Acta de Notificación de Detención a Familiar", 
    archivo: "plantillas/acta_notificacion_familiar.docx", 
    llevaHora: true, 
    esIndividual: true 
  },
  { 
    id: "dosaje_etilico", 
    aliases: ["dosaje_etilico", "acta_dosaje_etilico", "ACTA_NOTIFICACION_DOSAJE_ETILICO"], 
    titulo: "11. Notificación para Dosaje Etílico", 
    archivo: "plantillas/acta_dosaje_etilico.docx", 
    llevaHora: true, 
    esIndividual: true 
  },
  { 
    id: "control_identidad", 
    aliases: ["control_identidad", "acta_control_identidad", "ACTA_DE_CONTROL_DE_IDENTIDAD"], 
    titulo: "12. Acta de Control de Identidad Policial", 
    archivo: "plantillas/acta_control_identidad.docx", 
    llevaHora: true, 
    esIndividual: true 
  },
  { 
    id: "entrega_especies", 
    aliases: ["entrega_especies", "acta_entrega_especies", "ACTA_ENTREGA_DEVOLUCION_ESPECIES"], 
    titulo: "13. Acta de Entrega y Devolución de Especies", 
    archivo: "plantillas/acta_entrega_especies.docx", 
    llevaHora: true, 
    esIndividual: true 
  },
  { 
    id: "declaracion_intervenido", 
    aliases: ["declaracion_intervenido", "acta_declaracion", "ACTA_DECLARACION_DEL_INTERVENIDO"], 
    titulo: "14. Acta de Entrevista / Declaración del Intervenido", 
    archivo: "plantillas/acta_declaracion.docx", 
    llevaHora: true, 
    esIndividual: true 
  }
];

let actasManualesAdicionales = [];
let delitoConfigurado = "";
let idsActasConfiguradas = [];

let actasAProcesarSecuencia = [];
let indiceActaActual = 0;
let datosFormularioBase = {};
let horariosPorActa = {};

/**
 * REGISTRAR ACTA CUSTOM O MANUAL
 */
function registrarActaManual(nuevaActa) {
  if (!nuevaActa.id || !nuevaActa.titulo) {
    console.error("⚠️ El acta manual requiere al menos 'id' y 'titulo'.");
    return;
  }

  const estructuraCompleta = {
    id: nuevaActa.id,
    aliases: [nuevaActa.id, nuevaActa.id.toLowerCase()],
    titulo: nuevaActa.titulo,
    archivo: nuevaActa.archivo || `plantillas/${nuevaActa.id}.docx`,
    llevaHora: nuevaActa.llevaHora !== false,
    esIndividual: nuevaActa.esIndividual !== false,
    esVehicular: nuevaActa.esVehicular === true
  };

  const existe = CATALOGO_ACTAS.find(a => a.id === estructuraCompleta.id);
  if (!existe) {
    CATALOGO_ACTAS.push(estructuraCompleta);
    actasManualesAdicionales.push(estructuraCompleta);
    console.log(`✅ Acta manual '${estructuraCompleta.titulo}' registrada con éxito.`);
  }
}

/**
 * FORMATEADORES Y AUXILIARES DE TEXTO
 */
function formatearFechaPolicial(fechaCadena) {
  if (!fechaCadena) return "";

  const mesesPoliciales = [
    "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
    "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"
  ];

  if (fechaCadena.includes('-')) {
    const partes = fechaCadena.split('-');
    if (partes.length === 3) {
      const anio = partes[0];
      const mesIndex = parseInt(partes[1], 10) - 1;
      const dia = partes[2].padStart(2, '0');
      if (mesesPoliciales[mesIndex]) {
        return `${dia}${mesesPoliciales[mesIndex]}${anio}`;
      }
    }
  }

  if (fechaCadena.includes('/')) {
    const partes = fechaCadena.split('/');
    if (partes.length === 3) {
      const dia = partes[0].padStart(2, '0');
      const mesIndex = parseInt(partes[1], 10) - 1;
      const anio = partes[2];
      if (mesesPoliciales[mesIndex]) {
        return `${dia}${mesesPoliciales[mesIndex]}${anio}`;
      }
    }
  }

  return fechaCadena;
}

function sumarMinutosAHora(horaStr, minutosASumar) {
  if (!horaStr || !horaStr.includes(':')) return "00:00";
  const partes = horaStr.split(':');
  let horas = parseInt(partes[0], 10);
  let minutos = parseInt(partes[1], 10) + minutosASumar;

  while (minutos >= 60) {
    minutos -= 60;
    horas = (horas + 1) % 24;
  }

  const h = horas.toString().padStart(2, '0');
  const m = minutos.toString().padStart(2, '0');
  return `${h}:${m}`;
}

function procesarDocumentosRNT() {
  let hallazgos = [];

  const chkSoat = document.getElementById('chk_soat');
  if (chkSoat && chkSoat.checked) {
    const st = document.getElementById('st_soat') ? document.getElementById('st_soat').value : 'VIGENTE';
    const fec = document.getElementById('fec_soat') ? document.getElementById('fec_soat').value : '';
    hallazgos.push(`SOAT ${st}` + (st === 'VENCIDO' && fec ? ` con fecha de vencimiento ${formatearFechaPolicial(fec)}` : ''));
  }

  const chkItv = document.getElementById('chk_itv');
  if (chkItv && chkItv.checked) {
    const st = document.getElementById('st_itv') ? document.getElementById('st_itv').value : 'VIGENTE';
    const fec = document.getElementById('fec_itv') ? document.getElementById('fec_itv').value : '';
    hallazgos.push(`CITV (Inspección Técnica) ${st}` + (st === 'VENCIDO' && fec ? ` con fecha de vencimiento ${formatearFechaPolicial(fec)}` : ''));
  }

  const chkLunas = document.getElementById('chk_lunas');
  if (chkLunas && chkLunas.checked) {
    const st = document.getElementById('st_lunas') ? document.getElementById('st_lunas').value : 'CUENTA Y VIGENTE';
    hallazgos.push(`Permiso de Lunas Polarizadas: ${st}`);
  }

  return hallazgos.length > 0 ? hallazgos.join(', ') : "NO PRESENTA DOCUMENTACIÓN / EN PROCESO DE VERIFICACIÓN";
}

function obtenerListaIntervenidosForm() {
  if (typeof obtenerListaIntervenidos === 'function') {
    const lista = obtenerListaIntervenidos();
    if (lista && lista.length > 0) return lista;
  }

  if (window.pnp_lista_intervenidos && window.pnp_lista_intervenidos.length > 0) {
    return window.pnp_lista_intervenidos;
  }

  const local = localStorage.getItem('pnp_lista_intervenidos');
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (parsed && parsed.length > 0) return parsed;
    } catch (e) {}
  }

  const getValSafe = (id) => document.getElementById(id) ? document.getElementById(id).value.trim() : "S/D";
  return [{
    nombre: getValSafe('intervenido_nombre'),
    dni: getValSafe('intervenido_dni'),
    edad: getValSafe('edad'),
    estado_civil: getValSafe('estado_civil'),
    natural: getValSafe('natural'),
    celular: getValSafe('celular1'),
    papa: getValSafe('papa'),
    mama: getValSafe('mama'),
    ocupacion: getValSafe('ocupacion'),
    domicilio: getValSafe('domicilio'),
    asistido_confianza: getValSafe('asistido_confianza')
  }];
}

function obtenerListaVehiculosForm() {
  if (typeof obtenerListaVehiculos === 'function') {
    const lista = obtenerListaVehiculos();
    if (lista && lista.length > 0) return lista;
  }

  if (window.pnp_lista_vehiculos && window.pnp_lista_vehiculos.length > 0) {
    return window.pnp_lista_vehiculos;
  }

  const local = localStorage.getItem('pnp_lista_vehiculos');
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (parsed && parsed.length > 0) return parsed;
    } catch (e) {}
  }

  const getValSafe = (id) => document.getElementById(id) ? document.getElementById(id).value.trim() : "";
  const placa = getValSafe('placa_vehiculo_1') || getValSafe('placa_vehiculo') || "NO REGISTRA";
  const marca = getValSafe('marca_vehiculo_1') || getValSafe('marca_vehiculo') || "NO REGISTRA";
  const modelo = getValSafe('modelo_vehiculo_1') || getValSafe('modelo_vehiculo') || "NO REGISTRA";
  const color = getValSafe('color_vehiculo_1') || getValSafe('color_vehiculo') || "NO REGISTRA";

  return [{ placa, marca, modelo, color }];
}

function construirTextoVehiculosResumen(listaVehiculos) {
  if (!listaVehiculos || listaVehiculos.length === 0) return "NO REGISTRA";
  if (listaVehiculos.length === 1) {
    const v = listaVehiculos[0];
    return `el vehículo de placa N° ${v.placa} (Marca: ${v.marca}, Modelo: ${v.modelo}, Color/Estado: ${v.color})`;
  }
  const partes = listaVehiculos.map(v => `el vehículo de placa N° ${v.placa} (Marca: ${v.marca}, Modelo: ${v.modelo})`);
  const ultimo = partes.pop();
  return `${partes.join(', ')} y ${ultimo}`;
}

function obtenerTextoFiliacionCompletaMultiples(lista) {
  if (!lista || lista.length === 0) return "No registra intervenidos.";
  return lista.map((item, idx) => {
    const prefijo = lista.length > 1 ? `INTERVENIDO N° ${idx + 1}: ` : '';
    return `${prefijo}${item.nombre}, con ${item.edad} años de edad, natural de ${item.natural}, de ocupación ${item.ocupacion}, identificado con DNI N° ${item.dni}, quien refiere domiciliar en ${item.domicilio}, celular N° ${item.celular || 'S/N'}, estado civil ${item.estado_civil}, hijo de don ${item.papa || 'S/D'} y doña ${item.mama || 'S/D'}.`;
  }).join('\n\n');
}

function generarBloqueCierreYFirmas(horaFin, lista) {
  let textoCierre = `\n--- Siendo las ${horaFin} Horas del mismo día se dio por concluida la presente diligencia, firmando los participantes en señal de conformidad. -------------------\n\n` +
    `Se adjunta:\n` +
    `${typeof obtenerListaAdjuntosFormateada === 'function' ? obtenerListaAdjuntosFormateada() : ''}\n\n\n`;

  if (!lista || lista.length <= 1) {
    const int1 = (lista && lista[0]) ? lista[0] : { nombre: '{intervenido_nombre}', dni: '{intervenido_dni}' };
    textoCierre += 
      `                                              __________________________________\n` +
      `                                                        EL INTERVENIDO\n\n` +
      `                                              Nombre: ${int1.nombre}\n` +
      `                                              DNI N°: ${int1.dni}`;
  } else {
    lista.forEach((item, idx) => {
      textoCierre += 
        `                                              __________________________________\n` +
        `                                                    EL INTERVENIDO N° ${idx + 1}\n\n` +
        `                                              Nombre: ${item.nombre}\n` +
        `                                              DNI N°: ${item.dni}\n\n`;
    });
  }

  return textoCierre;
}

/**
 * INICIALIZACIÓN
 */
document.addEventListener('DOMContentLoaded', () => {
  delitoConfigurado = localStorage.getItem('pnp_delito_seleccionado') || "CONTROL DE IDENTIDAD POLICIAL";
  const actasJSON = localStorage.getItem('pnp_actas_seleccionadas');
  idsActasConfiguradas = actasJSON ? JSON.parse(actasJSON) : ["reg_personal"];

  const actasManualesGuardadas = localStorage.getItem('pnp_actas_manuales_custom');
  if (actasManualesGuardadas) {
    try {
      const listaCustom = JSON.parse(actasManualesGuardadas);
      listaCustom.forEach(a => registrarActaManual(a));
    } catch(e) {}
  }

  const resDelito = document.getElementById('resumenDelito');
  const resCant = document.getElementById('resumenActasCant');
  if (resDelito) resDelito.innerText = delitoConfigurado;
  if (resCant) resCant.innerText = `📄 ${idsActasConfiguradas.length} acta(s) seleccionada(s) para generar`;

  const fechaInput = document.getElementById('fecha');
  const hora1Input = document.getElementById('hora1');
  if (fechaInput) fechaInput.value = new Date().toISOString().split('T')[0];
  if (hora1Input) hora1Input.value = new Date().toTimeString().slice(0, 5);
});

/**
 * MANEJO DEL SUBMIT DEL FORMULARIO
 */
document.getElementById('expedienteForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  actasAProcesarSecuencia = [];
  
  idsActasConfiguradas.forEach(idSel => {
    const idLimpio = (typeof idSel === 'object' && idSel !== null) ? idSel.id : idSel;
    
    let coincide = CATALOGO_ACTAS.find(acta => 
      acta.id === idLimpio || acta.aliases.includes(idLimpio)
    );

    if (!coincide) {
      coincide = {
        id: idLimpio,
        aliases: [idLimpio],
        titulo: (typeof idSel === 'object' && idSel.titulo) ? idSel.titulo : `Acta de ${idLimpio}`,
        archivo: (typeof idSel === 'object' && idSel.archivo) ? idSel.archivo : `plantillas/${idLimpio}.docx`,
        llevaHora: true,
        esIndividual: true,
        esVehicular: false
      };
    }

    actasAProcesarSecuencia.push(coincide);
  });

  if (actasAProcesarSecuencia.length === 0) {
    alert(`⚠️ No se encontraron coincidencias para las actas seleccionadas.`);
    return;
  }

  const fechaRaw = document.getElementById('fecha').value;
  const listaVehiculos = obtenerListaVehiculosForm();
  const vehPrincipal = listaVehiculos[0] || { placa: "NO REGISTRA", marca: "NO REGISTRA", modelo: "NO REGISTRA", color: "NO REGISTRA" };

  datosFormularioBase = {
    delito: delitoConfigurado,
    distrito: document.getElementById('distrito').value,
    provincia: document.getElementById('provincia').value,
    region: document.getElementById('region').value,
    fecha: formatearFechaPolicial(fechaRaw),
    lugar: document.getElementById('lugar').value,

    motivo_justificatorio: document.getElementById('motivo_justificatorio') ? document.getElementById('motivo_justificatorio').value : "",
    unidad_disposicion: document.getElementById('unidad_disposicion') ? document.getElementById('unidad_disposicion').value : "SIAT-COM PNP HUANTA",

    placa_vehiculo: vehPrincipal.placa,
    marca_vehiculo: vehPrincipal.marca,
    modelo_vehiculo: vehPrincipal.modelo,
    color_vehiculo: vehPrincipal.color,
    vehiculos_resumen: construirTextoVehiculosResumen(listaVehiculos),

    drogas: document.getElementById('drogas') ? document.getElementById('drogas').value : "NEGATIVO",
    moneda: document.getElementById('moneda') ? document.getElementById('moneda').value : "NEGATIVO",
    joyas: document.getElementById('joyas') ? document.getElementById('joyas').value : "NEGATIVO",
    municion: document.getElementById('municion') ? document.getElementById('municion').value : "NEGATIVO",
    otros: document.getElementById('otros') ? document.getElementById('otros').value : "NEGATIVO",
    narrar_positivo: document.getElementById('narrar_positivo') ? document.getElementById('narrar_positivo').value : "NINGUNO",
    
    personal_interviniente: document.getElementById('personal_interviniente').value,
    grado: document.getElementById('grado').value,
    cip: document.getElementById('cip').value
  };

  indiceActaActual = 0;
  horariosPorActa = {};

  const horaInicialBase = document.getElementById('hora1').value || "08:00";
  avanzarAoSaltarAQuienLleveHora(horaInicialBase);
});

function avanzarAoSaltarAQuienLleveHora(horaSugeridaInicio) {
  while (indiceActaActual < actasAProcesarSecuencia.length) {
    const actaActual = actasAProcesarSecuencia[indiceActaActual];
    
    if (actaActual.id === "buen_trato" || actaActual.llevaHora === false) {
      horariosPorActa[actaActual.id] = { horaInicio: "", horaTermino: "" };
      indiceActaActual++;
    } else {
      mostrarModalHoraActa(indiceActaActual, horaSugeridaInicio);
      return;
    }
  }

  const modal = document.getElementById('modalHoras');
  if (modal) modal.style.display = 'none';
  ejecutarGeneracionFinalExpediente();
}

function mostrarModalHoraActa(index, horaSugeridaInicio) {
  const modalElem = document.getElementById('modalHoras');
  if (!modalElem) return;

  const acta = actasAProcesarSecuencia[index];
  const total = actasAProcesarSecuencia.length;

  document.getElementById('modalHorasTitulo').innerText = `⏰ Horario (${index + 1}/${total}): ${acta.titulo}`;
  document.getElementById('modalHorasSubtitulo').innerText = `Especifique hora de inicio y término para "${acta.titulo}":`;

  const horaTerminoSugerida = sumarMinutosAHora(horaSugeridaInicio, 5);

  document.getElementById('modalHoraInicio').value = horaSugeridaInicio;
  document.getElementById('modalHoraTermino').value = horaTerminoSugerida;

  const btnSiguiente = document.getElementById('btnSiguienteHora');
  const quedanMasConHora = actasAProcesarSecuencia.slice(index + 1).some(a => a.id !== "buen_trato" && a.llevaHora !== false);

  if (!quedanMasConHora) {
    btnSiguiente.innerHTML = "📦 Generar Expediente";
    btnSiguiente.className = "btn btn-success";
  } else {
    btnSiguiente.innerHTML = "Siguiente ➡️";
    btnSiguiente.className = "btn btn-primary";
  }

  modalElem.style.display = 'flex';
}

function cancelarProcesoHoras() {
  const modalElem = document.getElementById('modalHoras');
  if (modalElem) modalElem.style.display = 'none';
}

async function confirmarHoraActaActual() {
  const hInicio = document.getElementById('modalHoraInicio').value;
  const hTermino = document.getElementById('modalHoraTermino').value;

  if (!hInicio || !hTermino) {
    alert("⚠️ Debe ingresar ambas horas (inicio y término).");
    return;
  }

  const actaActual = actasAProcesarSecuencia[indiceActaActual];
  horariosPorActa[actaActual.id] = {
    horaInicio: hInicio,
    horaTermino: hTermino
  };

  indiceActaActual++;

  if (indiceActaActual < actasAProcesarSecuencia.length) {
    const siguienteSugerida = sumarMinutosAHora(hTermino, 1);
    avanzarAoSaltarAQuienLleveHora(siguienteSugerida);
  } else {
    const modal = document.getElementById('modalHoras');
    if (modal) modal.style.display = 'none';
    await ejecutarGeneracionFinalExpediente();
  }
}

/**
 * GENERACIÓN Y COMPILACIÓN FINAL DEL EXPEDIENTE (.DOCX / .ZIP)
 */
async function ejecutarGeneracionFinalExpediente() {
  const statusMsg = document.getElementById('statusMsg');
  if (statusMsg) {
    statusMsg.className = "alert-msg alert-success";
    statusMsg.style.display = "block";
    statusMsg.innerText = `Procesando actas e individualizando intervenidos y vehículos... Por favor espere.`;
  }

  try {
    const regPersonal = horariosPorActa['reg_personal'] || { horaInicio: "08:00", horaTermino: "08:05" };
    const lecturaDerechos = horariosPorActa['lectura_derechos'] || { horaInicio: "08:06", horaTermino: "08:11" };
    const detencionHorario = horariosPorActa['detencion'] || { horaInicio: "08:12", horaTermino: "08:17" };

    const hora5Val = detencionHorario.horaInicio || sumarMinutosAHora(lecturaDerechos.horaTermino, 1);
    const hora6Val = detencionHorario.horaTermino || sumarMinutosAHora(hora5Val, 5);
    const horaDetencionVal = sumarMinutosAHora(hora6Val, 2);

    const horaIntElem = document.getElementById('hora_intervencion');
    const horaIntVal = horaIntElem ? horaIntElem.value : regPersonal.horaInicio;

    const fiscalElem = document.getElementById('fiscal');
    const fiscalVal = fiscalElem ? (fiscalElem.value.trim() || "RMP NO ESPECIFICADO") : "RMP NO ESPECIFICADO";

    const tipoActElem = document.getElementById('tipo_actividad');
    const tipoActVal = tipoActElem ? tipoActElem.value : 'PATRULLAJE DE RUTINA';
    const nomOpElem = document.getElementById('nombre_operativo');
    const nomOpVal = nomOpElem ? nomOpElem.value.trim() : '';
    const actividadTexto = tipoActVal === 'OPERATIVO POLICIAL' ? `el O/P ${nomOpVal}` : `Patrullaje de Rutina`;

    const cantVehElem = document.getElementById('cant_vehiculos_pnp');
    const cantVeh = cantVehElem ? (parseInt(cantVehElem.value, 10) || 1) : 1;
    const vehiculosPNPObj = {};
    for (let i = 1; i <= cantVeh; i++) {
      const inputElem = document.getElementById(`placa_policial_${i}`);
      vehiculosPNPObj[`placa_policial${i}`] = inputElem ? (inputElem.value.trim() || "S/P") : "S/P";
    }

    const cantSecElem = document.getElementById('cant_secciones');
    const cantSec = cantSecElem ? (parseInt(cantSecElem.value, 10) || 1) : 1;
    const seccionesObj = {};
    let bloquesNarrativaLista = [];

    for (let i = 1; i <= cantSec; i++) {
      const titInputElem = document.getElementById(`titulo_sec_${i}`);
      const tituloFinal = titInputElem ? (titInputElem.value.trim() || `SECCIÓN ${i}:`) : `SECCIÓN ${i}:`;
      
      const txtAreaElem = document.getElementById(`agregar_intervencion_${i}`);
      const contenido = txtAreaElem ? txtAreaElem.value : '';
      
      seccionesObj[`titulo_intervencion${i}`] = tituloFinal;
      seccionesObj[`agregar_intervencion${i}`] = `${tituloFinal}\n${contenido}`;
      
      if (contenido.trim()) {
        bloquesNarrativaLista.push(`${tituloFinal}\n${contenido}`);
      }
    }

    // LISTAS PRINCIPALES DE ENTRADA
    const listaIntervenidos = obtenerListaIntervenidosForm();
    const listaVehiculos = obtenerListaVehiculosForm();

    // SINTAXIS Y TEXTOS DINÁMICOS
    let textoIntervenidosColectivo = "";
    if (listaIntervenidos.length === 1) {
      textoIntervenidosColectivo = `${listaIntervenidos[0].nombre} (${listaIntervenidos[0].edad} años), DNI N° ${listaIntervenidos[0].dni}`;
    } else {
      const partes = listaIntervenidos.map(item => `${item.nombre} (${item.edad} años), DNI N° ${item.dni}`);
      const ultimo = partes.pop();
      textoIntervenidosColectivo = `${partes.join(', ')} y ${ultimo}`;
    }

    const textoVehiculosColectivo = construirTextoVehiculosResumen(listaVehiculos);
    const filiacionCompleta = obtenerTextoFiliacionCompletaMultiples(listaIntervenidos);
    const horaTerminoTotal = horariosPorActa['intervencion']?.horaTermino || datosFormularioBase.hora2 || "08:30";
    const horaPruebaG = sumarMinutosAHora(horaIntVal, 15);
    const bloqueFirmasG = generarBloqueCierreYFirmas(horaTerminoTotal, listaIntervenidos);

    // OBJETO DE DATOS BASE COMPLETO CON SOPORTE PARA TODAS LAS PLANTILLAS
    const datosFinalesBase = {
      ...datosFormularioBase,
      ...vehiculosPNPObj,
      ...seccionesObj,
      
      // VARIABLES MAESTRAS DE LA PLANTILLA MAESTRA ACTA_INTERVENCION.DOCX
      filiacion_intervenidos: filiacionCompleta,
      resumen_intervenidos: textoIntervenidosColectivo,
      resumen_vehiculos: textoVehiculosColectivo,
      secciones_narrativa: bloquesNarrativaLista.join('\n\n'),
      calidad_detenido: listaIntervenidos.length > 1 ? "DETENIDOS" : "DETENIDO",
      bloque_firmas: bloqueFirmasG,
      hora_prueba: horaPruebaG,
      hora_termino: horaTerminoTotal,

      intervenidos_resumen: textoIntervenidosColectivo,
      vehiculos_resumen: textoVehiculosColectivo,
      hora_intervencion: horaIntVal,
      fiscal: fiscalVal,
      actividad_realizada: actividadTexto,
      documentos_retran: procesarDocumentosRNT(),
      hora1: regPersonal.horaInicio,
      hora2: regPersonal.horaTermino,
      hora3: lecturaDerechos.horaInicio,
      hora4: lecturaDerechos.horaTermino,
      hora5: hora5Val,
      hora6: hora6Val,
      hora_detencion: horaDetencionVal
    };

    // GUARDA EL ESTADO REUTILIZABLE/CLONABLE EN SUPABASE
    try {
      if (typeof supabaseClient !== 'undefined' && supabaseClient.from) {
        await supabaseClient.from('intervenciones').insert([{
          tipo_delito: datosFinalesBase.delito,
          fecha: datosFinalesBase.fecha,
          hora: datosFinalesBase.hora1,
          lugar: datosFinalesBase.lugar,
          intervenido_nombre: listaIntervenidos[0].nombre,
          intervenido_dni: listaIntervenidos[0].dni,
          efectivo_cargo: `${datosFinalesBase.grado} ${datosFinalesBase.personal_interviniente}`,
          datos_json: datosFinalesBase // <-- Guarda la intervención editable para clonar en el futuro
        }]);
      }
    } catch (errSupabase) {
      console.warn("Supabase offline o no disponible. Continuando generación local.");
    }

    const JSZipLib = window.JSZip || (typeof JSZip !== 'undefined' ? JSZip : null);
    const zip = new JSZipLib();
    let archivosAgregados = 0;

    // GENERACIÓN DE DOCUMENTOS (COLECTIVOS vs INDIVIDUALES)
    for (let acta of actasAProcesarSecuencia) {
      const hor = horariosPorActa[acta.id] || { horaInicio: "", horaTermino: "" };
      const esActaColectiva = (acta.esIndividual === false || acta.id === 'intervencion');
      const esActaVehicular = (acta.esVehicular === true || acta.id === 'sit_vehicular' || acta.id === 'reg_vehicular');

      if (esActaColectiva) {
        // CASO A: ACTA ÚNICA Y COLECTIVA (ACTA DE INTERVENCIÓN)
        const datosDocIntervencion = {
          ...datosFinalesBase,
          intervenido_nombre: textoIntervenidosColectivo,
          intervenido_dni: listaIntervenidos.map(i => i.dni).join(' / '),
          edad: listaIntervenidos.map(i => i.edad).join(' / '),
          estado_civil: listaIntervenidos[0].estado_civil,
          natural: listaIntervenidos[0].natural,
          celular1: listaIntervenidos[0].celular,
          papa: listaIntervenidos[0].papa,
          mama: listaIntervenidos[0].mama,
          ocupacion: listaIntervenidos[0].ocupacion,
          domicilio: listaIntervenidos[0].domicilio,
          asistido_confianza: listaIntervenidos[0].asistido_confianza,
          hora1: hor.horaInicio || datosFinalesBase.hora1,
          hora2: hor.horaTermino || datosFinalesBase.hora2
        };

        try {
          const blobDoc = await generarDocumentoWord(acta.archivo, datosDocIntervencion);
          zip.file(`${acta.titulo}.docx`, blobDoc);
          archivosAgregados++;
        } catch (err) {
          console.error(`Error al generar ${acta.archivo}:`, err);
        }

      } else if (esActaVehicular) {
        // CASO B: ACTAS VEHICULARES INDIVIDUALES (REPLICADAS POR CADA VEHÍCULO / PLACA)
        for (let idxV = 0; idxV < listaVehiculos.length; idxV++) {
          const veh = listaVehiculos[idxV];

          const datosDocVehiculo = {
            ...datosFinalesBase,
            placa_vehiculo: veh.placa,
            marca_vehiculo: veh.marca,
            modelo_vehiculo: veh.modelo,
            color_vehiculo: veh.color,
            hora1: hor.horaInicio || datosFinalesBase.hora1,
            hora2: hor.horaTermino || datosFinalesBase.hora2
          };

          try {
            const blobDoc = await generarDocumentoWord(acta.archivo, datosDocVehiculo);
            const sufijoVehiculo = (listaVehiculos.length > 1) ? `_PLACA_${veh.placa}` : '';
            const nombreArchivoDoc = `${acta.titulo}${sufijoVehiculo}.docx`;

            zip.file(nombreArchivoDoc, blobDoc);
            archivosAgregados++;
          } catch (err) {
            console.error(`Error al generar ${acta.archivo} para vehículo placa ${veh.placa}:`, err);
          }
        }

      } else {
        // CASO C: ACTAS PERSONALES INDIVIDUALES (REPLICADAS POR CADA DETENIDO)
        for (let idx = 0; idx < listaIntervenidos.length; idx++) {
          const persona = listaIntervenidos[idx];

          const datosDocIndividual = {
            ...datosFinalesBase,
            intervenido_nombre: persona.nombre,
            intervenido_dni: persona.dni,
            edad: persona.edad,
            estado_civil: persona.estado_civil,
            natural: persona.natural,
            celular1: persona.celular || "S/N",
            papa: persona.papa || "S/D",
            mama: persona.mama || "S/D",
            ocupacion: persona.ocupacion,
            domicilio: persona.domicilio,
            asistido_confianza: persona.asistido_confianza,
            hora1: hor.horaInicio || datosFinalesBase.hora1,
            hora2: hor.horaTermino || datosFinalesBase.hora2
          };

          try {
            const blobDoc = await generarDocumentoWord(acta.archivo, datosDocIndividual);
            const sufijoPersona = (listaIntervenidos.length > 1) ? `_DNI_${persona.dni}` : '';
            const nombreArchivoDoc = `${acta.titulo}${sufijoPersona}.docx`;
            
            zip.file(nombreArchivoDoc, blobDoc);
            archivosAgregados++;
          } catch (err) {
            console.error(`Error al generar ${acta.archivo} para DNI ${persona.dni}:`, err);
          }
        }
      }
    }

    // DESCARGA FINAL (.ZIP O .DOCX)
    if (archivosAgregados === 1 && listaIntervenidos.length === 1 && listaVehiculos.length === 1) {
      const soloFicheroKey = Object.keys(zip.files)[0];
      const blobUnico = await zip.file(soloFicheroKey).async("blob");
      saveAs(blobUnico, soloFicheroKey);
    } else if (archivosAgregados > 0) {
      const zipContent = await zip.generateAsync({ type: "blob" });
      saveAs(zipContent, `Expediente_PNP_${datosFinalesBase.distrito}_${datosFinalesBase.fecha}.zip`);
    }

    if (statusMsg) {
      statusMsg.className = "alert-msg alert-success";
      statusMsg.innerText = "✅ ¡Expediente generado exitosamente!";
    }

  } catch (err) {
    if (statusMsg) {
      statusMsg.className = "alert-msg alert-danger";
      statusMsg.innerText = "❌ Error al procesar expediente: " + err.message;
    }
  }
}

/**
 * RENDERIZADOR DOCXTEMPLATER ANTI-CACHE
 */
async function generarDocumentoWord(rutaPlantilla, datos) {
  const PizZipLib = window.PizZip || (typeof PizZip !== 'undefined' ? PizZip : null);
  const DocxLib = window.docxtemplater || (typeof docxtemplater !== 'undefined' ? docxtemplater : null);

  if (!PizZipLib) throw new Error("No se pudo cargar PizZip.");

  const urlAntiCache = `${rutaPlantilla}?t=${new Date().getTime()}`;
  const response = await fetch(urlAntiCache);
  if (!response.ok) throw new Error(`Plantilla no encontrada en GitHub: ${rutaPlantilla}`);

  const arrayBuffer = await response.arrayBuffer();
  const zip = new PizZipLib(arrayBuffer);

  const doc = new DocxLib(zip, { 
    paragraphLoop: true, 
    linebreaks: true,
    nullGetter: function() { return ""; }
  });

  doc.render(datos);

  return doc.getZip().generate({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

function limpiarPantalla() {
  if (confirm("¿Deseas limpiar la pantalla para registrar un nuevo expediente?")) {
    document.getElementById('expedienteForm').reset();
    const fechaInput = document.getElementById('fecha');
    const hora1Input = document.getElementById('hora1');
    if (fechaInput) fechaInput.value = new Date().toISOString().split('T')[0];
    if (hora1Input) hora1Input.value = new Date().toTimeString().slice(0, 5);
  }
}
