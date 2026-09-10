/**
 * CATALOGO MASTER DE ACTAS PNP (14 ACTAS OFICIALES + SOPORTE MANUAL)
 */
const CATALOGO_ACTAS = [
  { 
    id: "intervencion", 
    aliases: ["intervencion", "acta_intervencion", "01_ACTA_DE_INTERVENCION_POLICIAL"], 
    titulo: "01. Acta de Intervención Policial", 
    archivo: "plantilla/acta_intervencion.docx", 
    llevaHora: true, 
    esIndividual: false // ÚNICA PARA TODOS LOS DETENIDOS
  },
  { 
    id: "reg_personal", 
    aliases: ["reg_personal", "acta_registro_personal", "registro_personal", "ACTA_DE_REGISTRO_PERSONAL"], 
    titulo: "02. Acta de Registro Personal e Incautación", 
    archivo: "plantilla/acta_registro_personal.docx", 
    llevaHora: true, 
    esIndividual: true // INDIVIDUAL POR DETENIDO
  },
  { 
    id: "lectura_derechos", 
    aliases: ["lectura_derechos", "acta_lectura_derechos", "ACTA_DE_LECTURA_DE_DERECHOS"], 
    titulo: "03. Acta de Lectura de Derechos", 
    archivo: "plantilla/acta_lectura_derechos.docx", 
    llevaHora: true, 
    esIndividual: true 
  },
  { 
    id: "detencion", 
    aliases: ["detencion", "acta_detencion", "ACTA_DE_DETENCION_POLICIAL"], 
    titulo: "04. Acta de Detención Policial", 
    archivo: "plantilla/acta_detencion.docx", 
    llevaHora: true, 
    esIndividual: true 
  },
  { 
    id: "buen_trato", 
    aliases: ["buen_trato", "constancia_buen_trato", "buentrato", "acta_buen_trato", "CONSTANCIA_DE_BUEN_TRATO"], 
    titulo: "05. Constancia de Buen Trato e Integridad Física", 
    archivo: "plantilla/acta_buen_trato.docx", 
    llevaHora: false, 
    esIndividual: true 
  },
  { 
    id: "sit_vehicular", 
    aliases: ["sit_vehicular", "acta_situacion_vehicular", "situacion_vehicular", "ACTA_DE_SITUACION_VEHICULAR"], 
    titulo: "06. Acta de Situación Vehicular", 
    archivo: "plantilla/acta_situacion_vehicular.docx", 
    llevaHora: true, 
    esIndividual: true 
  },
  { 
    id: "reg_vehicular", 
    aliases: ["reg_vehicular", "acta_registro_vehicular", "registro_vehicular", "ACTA_DE_REGISTRO_VEHICULAR"], 
    titulo: "07. Acta de Registro Vehicular", 
    archivo: "plantilla/acta_registro_vehicular.docx", 
    llevaHora: true, 
    esIndividual: true 
  },
  { 
    id: "lacrado", 
    aliases: ["lacrado", "acta_lacrado", "ACTA_DE_LACRADO_CADENA_CUSTODIA"], 
    titulo: "08. Acta de Lacrado / Cadena de Custodia", 
    archivo: "plantilla/acta_lacrado.docx", 
    llevaHora: true, 
    esIndividual: true 
  },
  { 
    id: "comunicacion", 
    aliases: ["comunicacion", "comunicacion_fiscal", "acta_comunicacion", "ACTA_DE_COMUNICACION_AL_RMP"], 
    titulo: "09. Acta de Comunicación Telefónica al RMP", 
    archivo: "plantilla/acta_comunicacion.docx", 
    llevaHora: true, 
    esIndividual: true 
  },
  { 
    id: "notif_detencion", 
    aliases: ["notif_detencion", "acta_notificacion_familiar", "ACTA_NOTIFICACION_DETENCION_FAMILIAR"], 
    titulo: "10. Acta de Notificación de Detención a Familiar", 
    archivo: "plantilla/acta_notificacion_familiar.docx", 
    llevaHora: true, 
    esIndividual: true 
  },
  { 
    id: "dosaje_etilico", 
    aliases: ["dosaje_etilico", "acta_dosaje_etilico", "ACTA_NOTIFICACION_DOSAJE_ETILICO"], 
    titulo: "11. Notificación para Dosaje Etílico", 
    archivo: "plantilla/acta_dosaje_etilico.docx", 
    llevaHora: true, 
    esIndividual: true 
  },
  { 
    id: "control_identidad", 
    aliases: ["control_identidad", "acta_control_identidad", "ACTA_DE_CONTROL_DE_IDENTIDAD"], 
    titulo: "12. Acta de Control de Identidad Policial", 
    archivo: "plantilla/acta_control_identidad.docx", 
    llevaHora: true, 
    esIndividual: true 
  },
  { 
    id: "entrega_especies", 
    aliases: ["entrega_especies", "acta_entrega_especies", "ACTA_ENTREGA_DEVOLUCION_ESPECIES"], 
    titulo: "13. Acta de Entrega y Devolución de Especies", 
    archivo: "plantilla/acta_entrega_especies.docx", 
    llevaHora: true, 
    esIndividual: true 
  },
  { 
    id: "declaracion_intervenido", 
    aliases: ["declaracion_intervenido", "acta_declaracion", "ACTA_DECLARACION_DEL_INTERVENIDO"], 
    titulo: "14. Acta de Entrevista / Declaración del Intervenido", 
    archivo: "plantilla/acta_declaracion.docx", 
    llevaHora: true, 
    esIndividual: true 
  }
];

let actasManualesAdicionales = []; // Guarda actas creadas dinámicamente
let delitoConfigurado = "";
let idsActasConfiguradas = [];

let actasAProcesarSecuencia = [];
let indiceActaActual = 0;
let datosFormularioBase = {};
let horariosPorActa = {};

/**
 * FUNCION PARA AGREGAR UN ACTA MANUALMENTE AL SISTEMA
 * Puede llamarse desde consola, un modal o desde el menu de configuración
 */
function registrarActaManual(nuevaActa) {
  // Estructura esperada: { id, titulo, archivo, llevaHora, esIndividual }
  if (!nuevaActa.id || !nuevaActa.titulo) {
    console.error("⚠️ El acta manual requiere al menos 'id' y 'titulo'.");
    return;
  }

  const estructuraCompleta = {
    id: nuevaActa.id,
    aliases: [nuevaActa.id, nuevaActa.id.toLowerCase()],
    titulo: nuevaActa.titulo,
    archivo: nuevaActa.archivo || `plantilla/${nuevaActa.id}.docx`,
    llevaHora: nuevaActa.llevaHora !== false,
    esIndividual: nuevaActa.esIndividual !== false // Por defecto es individual salvo que se indique false
  };

  // Evitar duplicados
  const existe = CATALOGO_ACTAS.find(a => a.id === estructuraCompleta.id);
  if (!existe) {
    CATALOGO_ACTAS.push(estructuraCompleta);
    actasManualesAdicionales.push(estructuraCompleta);
    console.log(`✅ Acta manual '${estructuraCompleta.titulo}' registrada con éxito.`);
  }
}

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
  if (!horaStr) return "00:00";
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

// OBTENER TODOS LOS INTERVENIDOS REGISTRADOS EN EL PASO 1
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

document.addEventListener('DOMContentLoaded', () => {
  delitoConfigurado = localStorage.getItem('pnp_delito_seleccionado') || "CONTROL DE IDENTIDAD POLICIAL";
  const actasJSON = localStorage.getItem('pnp_actas_seleccionadas');
  idsActasConfiguradas = actasJSON ? JSON.parse(actasJSON) : ["reg_personal"];

  // Cargar actas manuales personalizadas si existen en localStorage
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

document.getElementById('expedienteForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Mapear actas seleccionadas resolviendo catálogo estándar y dinámicas/manuales
  actasAProcesarSecuencia = [];
  
  idsActasConfiguradas.forEach(idSel => {
    const idLimpio = (typeof idSel === 'object' && idSel !== null) ? idSel.id : idSel;
    
    // Buscar en catálogo
    let coincide = CATALOGO_ACTAS.find(acta => 
      acta.id === idLimpio || acta.aliases.includes(idLimpio)
    );

    // Si no está en el catálogo oficial (es una acta agregada manualmente sobre la marcha)
    if (!coincide) {
      coincide = {
        id: idLimpio,
        aliases: [idLimpio],
        titulo: (typeof idSel === 'object' && idSel.titulo) ? idSel.titulo : `Acta de ${idLimpio}`,
        archivo: (typeof idSel === 'object' && idSel.archivo) ? idSel.archivo : `plantilla/${idLimpio}.docx`,
        llevaHora: true,
        esIndividual: true // Por defecto se individualiza por detenido
      };
    }

    actasAProcesarSecuencia.push(coincide);
  });

  if (actasAProcesarSecuencia.length === 0) {
    alert(`⚠️ No se encontraron coincidencias para las actas seleccionadas.`);
    return;
  }

  const placaInput = document.getElementById('placa_vehiculo');
  const marcaInput = document.getElementById('marca_vehiculo');
  const modeloInput = document.getElementById('modelo_vehiculo');
  const colorInput = document.getElementById('color_vehiculo');
  const fechaRaw = document.getElementById('fecha').value;

  datosFormularioBase = {
    delito: delitoConfigurado,
    distrito: document.getElementById('distrito').value,
    provincia: document.getElementById('provincia').value,
    region: document.getElementById('region').value,
    fecha: formatearFechaPolicial(fechaRaw),
    lugar: document.getElementById('lugar').value,

    motivo_justificatorio: document.getElementById('motivo_justificatorio') ? document.getElementById('motivo_justificatorio').value : "",

    placa_vehiculo: placaInput ? (placaInput.value || "NO REGISTRA") : "NO REGISTRA",
    marca_vehiculo: marcaInput ? (marcaInput.value || "NO REGISTRA") : "NO REGISTRA",
    modelo_vehiculo: modeloInput ? (modeloInput.value || "NO REGISTRA") : "NO REGISTRA",
    color_vehiculo: colorInput ? (colorInput.value || "NO REGISTRA") : "NO REGISTRA",

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

  document.getElementById('modalHoras').style.display = 'none';
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
    document.getElementById('modalHoras').style.display = 'none';
    await ejecutarGeneracionFinalExpediente();
  }
}

async function ejecutarGeneracionFinalExpediente() {
  const statusMsg = document.getElementById('statusMsg');
  statusMsg.className = "alert-msg alert-success";
  statusMsg.style.display = "block";
  statusMsg.innerText = `Procesando actas e individualizando intervenidos... Por favor espere.`;

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
    for (let i = 1; i <= cantSec; i++) {
      const titInputElem = document.getElementById(`titulo_sec_${i}`);
      const tituloFinal = titInputElem ? (titInputElem.value.trim() || `SECCIÓN ${i}:`) : `SECCIÓN ${i}:`;
      
      const txtAreaElem = document.getElementById(`agregar_intervencion_${i}`);
      const contenido = txtAreaElem ? txtAreaElem.value : '';
      
      seccionesObj[`titulo_intervencion${i}`] = tituloFinal;
      seccionesObj[`agregar_intervencion${i}`] = `${tituloFinal}\n${contenido}`;
    }

    // OBTENER LISTA DE TODOS LOS INTERVENIDOS
    const listaIntervenidos = obtenerListaIntervenidosForm();

    // RESUMEN COLECTIVO PARA NARRATIVA DEL ACTA DE INTERVENCIÓN
    let textoIntervenidosColectivo = "";
    if (listaIntervenidos.length === 1) {
      textoIntervenidosColectivo = `${listaIntervenidos[0].nombre} (${listaIntervenidos[0].edad} años), DNI N° ${listaIntervenidos[0].dni}`;
    } else {
      const partes = listaIntervenidos.map(item => `${item.nombre} (${item.edad} años), DNI N° ${item.dni}`);
      const ultimo = partes.pop();
      textoIntervenidosColectivo = `${partes.join(', ')} y ${ultimo}`;
    }

    const datosFinalesBase = {
      ...datosFormularioBase,
      ...vehiculosPNPObj,
      ...seccionesObj,
      intervenidos_resumen: textoIntervenidosColectivo,
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

    // REGISTRO EN SUPABASE
    try {
      if (typeof supabaseClient !== 'undefined' && supabaseClient.from) {
        await supabaseClient.from('intervenciones').insert([{
          tipo_delito: datosFinalesBase.delito,
          fecha: datosFinalesBase.fecha,
          hora: datosFinalesBase.hora1,
          lugar: datosFinalesBase.lugar,
          intervenido_nombre: listaIntervenidos[0].nombre,
          intervenido_dni: listaIntervenidos[0].dni,
          efectivo_cargo: `${datosFinalesBase.grado} ${datosFinalesBase.personal_interviniente}`
        }]);
      }
    } catch (errSupabase) {
      console.warn("Ejecutando en modo offline.");
    }

    const JSZipLib = window.JSZip || (typeof JSZip !== 'undefined' ? JSZip : null);
    const zip = new JSZipLib();
    let archivosAgregados = 0;

    // PROCESAMIENTO SEGÚN LA NATURALEZA DEL ACTA (GENERAL VS INDIVIDUAL)
    for (let acta of actasAProcesarSecuencia) {
      const hor = horariosPorActa[acta.id] || { horaInicio: "", horaTermino: "" };
      const esActaIndividual = (acta.esIndividual !== false && acta.id !== 'intervencion');

      if (!esActaIndividual) {
        // =========================================================
        // CASO A: ACTA COLECTIVA / ÚNICA (ACTA DE INTERVENCIÓN)
        // =========================================================
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

      } else {
        // =========================================================
        // CASO B: ACTAS INDIVIDUALES (REPLICADAS POR CADA INTERVENIDO)
        // =========================================================
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

    // DESCARGA DE RESULTADO (.ZIP O .DOCX)
    if (archivosAgregados === 1 && listaIntervenidos.length === 1) {
      const soloFicheroKey = Object.keys(zip.files)[0];
      const blobUnico = await zip.file(soloFicheroKey).async("blob");
      saveAs(blobUnico, soloFicheroKey);
    } else if (archivosAgregados > 0) {
      const zipContent = await zip.generateAsync({ type: "blob" });
      saveAs(zipContent, `Expediente_PNP_${datosFinalesBase.distrito}_${datosFinalesBase.fecha}.zip`);
    }

    statusMsg.innerText = "¡Expediente generado exitosamente!";

  } catch (err) {
    statusMsg.className = "alert-msg alert-danger";
    statusMsg.innerText = "Error al procesar expediente: " + err.message;
  }
}

async function generarDocumentoWord(rutaPlantilla, datos) {
  const PizZipLib = window.PizZip || (typeof PizZip !== 'undefined' ? PizZip : null);
  const DocxLib = window.docxtemplater || (typeof docxtemplater !== 'undefined' ? docxtemplater : null);

  if (!PizZipLib) throw new Error("No se pudo cargar PizZip.");

  const urlAntiCache = `${rutaPlantilla}?t=${new Date().getTime()}`;
  const response = await fetch(urlAntiCache);
  if (!response.ok) throw new Error(`Plantilla no encontrada: ${rutaPlantilla}`);

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
