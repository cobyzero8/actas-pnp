// CATÁLOGO COMPLETO DE ACTAS CON ALIAS FLEXIBLES
const CATALOGO_ACTAS = [
  { id: "reg_personal", aliases: ["reg_personal", "acta_registro_personal", "registro_personal"], titulo: "01. Acta de Registro Personal", archivo: "plantilla/acta_registro_personal.docx", llevaHora: true },
  { id: "lectura_derechos", aliases: ["lectura_derechos", "acta_lectura_derechos"], titulo: "02. Acta de Lectura de Derechos", archivo: "plantilla/acta_lectura_derechos.docx", llevaHora: true },
  { id: "detencion", aliases: ["detencion", "acta_detencion"], titulo: "03. Acta de Detención Policial", archivo: "plantilla/acta_detencion.docx", llevaHora: true },
  { id: "buen_trato", aliases: ["buen_trato", "constancia_buen_trato", "buentrato", "acta_buen_trato"], titulo: "04. Constancia de Buen Trato", archivo: "plantilla/acta_buen_trato.docx", llevaHora: false }, // <--- NO LLEVA HORA
  { id: "sit_vehicular", aliases: ["sit_vehicular", "acta_situacion_vehicular", "situacion_vehicular"], titulo: "05. Acta de Situación Vehicular", archivo: "plantilla/acta_situacion_vehicular.docx", llevaHora: true },
  { id: "reg_vehicular", aliases: ["reg_vehicular", "acta_registro_vehicular", "registro_vehicular"], titulo: "06. Acta de Registro Vehicular", archivo: "plantilla/acta_registro_vehicular.docx", llevaHora: true },
  { id: "intervencion", aliases: ["intervencion", "acta_intervencion"], titulo: "07. Acta de Intervención Policial", archivo: "plantilla/acta_intervencion.docx", llevaHora: true },
  { id: "lacrado", aliases: ["lacrado", "acta_lacrado"], titulo: "08. Acta de Lacrado / Cadena de Custodia", archivo: "plantilla/acta_lacrado.docx", llevaHora: true },
  { id: "comunicacion", aliases: ["comunicacion", "acta_comunicacion"], titulo: "09. Acta de Comunicación Telefónica", archivo: "plantilla/acta_comunicacion.docx", llevaHora: true }
];

let delitoConfigurado = "";
let idsActasConfiguradas = [];

// VARIABLES PARA EL FLUJO INTERACTIVO DE HORARIOS
let actasAProcesarSecuencia = [];
let indiceActaActual = 0;
let datosFormularioBase = {};
let horariosPorActa = {};

// CONVERSOR UNIVERSAL A FORMATO POLICIAL (Ejemplo: 2026-09-09 -> 09SEP2026)
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

// FUNCIÓN AUXILIAR PARA SUMAR MINUTOS A UNA HORA HH:MM
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

document.addEventListener('DOMContentLoaded', () => {
  delitoConfigurado = localStorage.getItem('pnp_delito_seleccionado') || "CONTROL DE IDENTIDAD POLICIAL";
  const actasJSON = localStorage.getItem('pnp_actas_seleccionadas');
  idsActasConfiguradas = actasJSON ? JSON.parse(actasJSON) : ["reg_personal"];

  const resDelito = document.getElementById('resumenDelito');
  const resCant = document.getElementById('resumenActasCant');
  if (resDelito) resDelito.innerText = delitoConfigurado;
  if (resCant) resCant.innerText = `📄 ${idsActasConfiguradas.length} acta(s) seleccionada(s) para generar`;

  const fechaInput = document.getElementById('fecha');
  const hora1Input = document.getElementById('hora1');
  if (fechaInput) fechaInput.value = new Date().toISOString().split('T')[0];
  if (hora1Input) hora1Input.value = new Date().toTimeString().slice(0, 5);
});

// INICIO DEL PROCESO: CAPTURA DE DATOS Y BÚSQUEDA DE LA PRIMERA ACTA QUE LLEVE HORA
document.getElementById('expedienteForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // FILTRADO CON COMPATIBILIDAD DE ALIAS DE IDs
  actasAProcesarSecuencia = CATALOGO_ACTAS.filter(acta => 
    idsActasConfiguradas.some(idSel => acta.aliases.includes(idSel) || acta.id === idSel)
  );

  if (actasAProcesarSecuencia.length === 0) {
    alert(`⚠️ No se encontraron coincidencias para las actas seleccionadas. Regrese al menú.`);
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
    intervenido_nombre: document.getElementById('intervenido_nombre').value,
    intervenido_dni: document.getElementById('intervenido_dni').value,
    edad: document.getElementById('edad').value,
    natural: document.getElementById('natural').value,

    celular1: document.getElementById('celular1') ? (document.getElementById('celular1').value.trim() || "S/N") : "S/N",
    papa: document.getElementById('papa') ? (document.getElementById('papa').value.trim() || "S/D") : "S/D",
    mama: document.getElementById('mama') ? (document.getElementById('mama').value.trim() || "S/D") : "S/D",

    motivo_justificatorio: document.getElementById('motivo_justificatorio') ? document.getElementById('motivo_justificatorio').value : "",

    ocupacion: document.getElementById('ocupacion').value,
    domicilio: document.getElementById('domicilio').value,
    asistido_confianza: document.getElementById('asistido_confianza').value,
    
    placa_vehiculo: placaInput ? (placaInput.value || "NO REGISTRA") : "NO REGISTRA",
    marca_vehiculo: marcaInput ? (marcaInput.value || "NO REGISTRA") : "NO REGISTRA",
    modelo_vehiculo: modeloInput ? (modeloInput.value || "NO REGISTRA") : "NO REGISTRA",
    color_vehiculo: colorInput ? (colorInput.value || "NO REGISTRA") : "NO REGISTRA",

    drogas: document.getElementById('drogas').value,
    moneda: document.getElementById('moneda').value,
    joyas: document.getElementById('joyas').value,
    municion: document.getElementById('municion').value,
    otros: document.getElementById('otros').value,
    narrar_positivo: document.getElementById('narrar_positivo').value,
    
    personal_interviniente: document.getElementById('personal_interviniente').value,
    grado: document.getElementById('grado').value,
    cip: document.getElementById('cip').value
  };

  // REINICIAR SECUENCIA DE HORARIOS
  indiceActaActual = 0;
  horariosPorActa = {};

  const horaInicialBase = document.getElementById('hora1').value || "08:00";
  avanzarAoSaltarAQuienLleveHora(horaInicialBase);
});

// BUSCA LA SIGUIENTE ACTA QUE REQUIERA HORA, SALTANDO LAS QUE NO (COMO BUEN TRATO)
function avanzarAoSaltarAQuienLleveHora(horaSugeridaInicio) {
  while (indiceActaActual < actasAProcesarSecuencia.length) {
    const actaActual = actasAProcesarSecuencia[indiceActaActual];
    if (actaActual.llevaHora) {
      mostrarModalHoraActa(indiceActaActual, horaSugeridaInicio);
      return;
    } else {
      // Si no lleva hora (ej. Constancia de Buen Trato), se le asigna valor vacío por defecto y avanza
      horariosPorActa[actaActual.id] = { horaInicio: "", horaTermino: "" };
      indiceActaActual++;
    }
  }

  // Si ya se evaluaron todas las actas, pasa directamente a generar
  document.getElementById('modalHoras').style.display = 'none';
  ejecutarGeneracionFinalExpediente();
}

// DESPLIEGA EL MODAL PARA EL ACTA ACTUAL QUE SÍ LLEVA HORA
function mostrarModalHoraActa(index, horaSugeridaInicio) {
  const modalElem = document.getElementById('modalHoras');
  if (!modalElem) {
    alert("⚠️ Falta integrar el contenedor 'modalHoras' en formulario.html.");
    return;
  }

  const acta = actasAProcesarSecuencia[index];
  const total = actasAProcesarSecuencia.length;

  document.getElementById('modalHorasTitulo').innerText = `⏰ Horario (${index + 1}/${total}): ${acta.titulo}`;
  document.getElementById('modalHorasSubtitulo').innerText = `Especifique hora de inicio y término para "${acta.titulo}":`;

  const horaTerminoSugerida = sumarMinutosAHora(horaSugeridaInicio, 5);

  document.getElementById('modalHoraInicio').value = horaSugeridaInicio;
  document.getElementById('modalHoraTermino').value = horaTerminoSugerida;

  const btnSiguiente = document.getElementById('btnSiguienteHora');
  // Verificar si ya no quedan más actas con hora pendientes
  const quedanMasConHora = actasAProcesarSecuencia.slice(index + 1).some(a => a.llevaHora);

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

// CONFIRMA LA HORA DE LA ACTA EN CURSO Y BUSCA LA SIGUIENTE
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

// PROCESA LA GENERACIÓN DE DOCUMENTOS
async function ejecutarGeneracionFinalExpediente() {
  const statusMsg = document.getElementById('statusMsg');
  statusMsg.className = "alert-msg alert-success";
  statusMsg.style.display = "block";
  statusMsg.innerText = `Procesando ${actasAProcesarSecuencia.length} acta(s)... Por favor espere.`;

  try {
    const primeraActaConHora = actasAProcesarSecuencia.find(a => a.llevaHora);
    const primerHorario = primeraActaConHora ? horariosPorActa[primeraActaConHora.id] : { horaInicio: "08:00", horaTermino: "08:05" };

    const actaDerechos = actasAProcesarSecuencia.find(a => a.id === "lectura_derechos");
    const horarioDerechos = actaDerechos ? horariosPorActa["lectura_derechos"] : null;

    const datosFinales = {
      ...datosFormularioBase,
      hora1: primerHorario ? primerHorario.horaInicio : "08:00",
      hora2: primerHorario ? primerHorario.horaTermino : "08:05",
      hora3: horarioDerechos ? horarioDerechos.horaInicio : sumarMinutosAHora(primerHorario ? primerHorario.horaTermino : "08:05", 1),
      hora4: horarioDerechos ? horarioDerechos.horaTermino : sumarMinutosAHora(primerHorario ? primerHorario.horaTermino : "08:05", 6)
    };

    // GUARDAR EN SUPABASE
    try {
      if (typeof supabaseClient !== 'undefined' && supabaseClient.from) {
        await supabaseClient.from('intervenciones').insert([{
          tipo_delito: datosFinales.delito,
          fecha: datosFinales.fecha,
          hora: datosFinales.hora1,
          lugar: datosFinales.lugar,
          intervenido_nombre: datosFinales.intervenido_nombre,
          intervenido_dni: datosFinales.intervenido_dni,
          efectivo_cargo: `${datosFinales.grado} ${datosFinales.personal_interviniente}`
        }]);
      }
    } catch (errSupabase) {
      console.warn("Ejecutando en modo offline.");
    }

    // GENERAR UN SOLO DOCX O UN ARCHIVO ZIP COMPRIMIDO
    if (actasAProcesarSecuencia.length === 1) {
      const acta = actasAProcesarSecuencia[0];
      const hor = horariosPorActa[acta.id] || { horaInicio: datosFinales.hora1, horaTermino: datosFinales.hora2 };
      const datosActaUnica = {
        ...datosFinales,
        hora1: hor.horaInicio || datosFinales.hora1,
        hora2: hor.horaTermino || datosFinales.hora2
      };
      const blobDoc = await generarDocumentoWord(acta.archivo, datosActaUnica);
      saveAs(blobDoc, `${acta.id}_${datosFinales.intervenido_dni}.docx`);
    } else {
      const zip = new JSZip();
      let archivosAgregados = 0;

      for (let acta of actasAProcesarSecuencia) {
        try {
          const hor = horariosPorActa[acta.id] || { horaInicio: "", horaTermino: "" };
          const datosDocumento = {
            ...datosFinales,
            hora1: hor.horaInicio || datosFinales.hora1,
            hora2: hor.horaTermino || datosFinales.hora2
          };
          const blobDoc = await generarDocumentoWord(acta.archivo, datosDocumento);
          zip.file(`${acta.titulo}.docx`, blobDoc);
          archivosAgregados++;
        } catch (err) {
          console.error(`Error al cargar la plantilla ${acta.archivo}:`, err);
          alert(`⚠️ No se encontró la plantilla "${acta.archivo}" en GitHub.`);
        }
      }

      if (archivosAgregados > 0) {
        const zipContent = await zip.generateAsync({ type: "blob" });
        saveAs(zipContent, `Expediente_${datosFinales.intervenido_dni}_${datosFinales.fecha}.zip`);
      }
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

  if (!PizZipLib) {
    throw new Error("No se pudo cargar la librería PizZip.");
  }

  const response = await fetch(rutaPlantilla);
  if (!response.ok) {
    throw new Error(`No se encontró el archivo de la plantilla en: ${rutaPlantilla}`);
  }
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
  if (confirm("¿Deseas limpiar la pantalla para registrar un nuevo intervenido?")) {
    document.getElementById('expedienteForm').reset();
    const fechaInput = document.getElementById('fecha');
    const hora1Input = document.getElementById('hora1');
    if (fechaInput) fechaInput.value = new Date().toISOString().split('T')[0];
    if (hora1Input) hora1Input.value = new Date().toTimeString().slice(0, 5);
  }
}
