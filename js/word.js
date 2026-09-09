// CATÁLOGO COMPLETO DE ACTAS
const CATALOGO_ACTAS = [
  { id: "reg_personal", titulo: "01. Acta de Registro Personal", archivo: "plantilla/acta_registro_personal.docx" },
  { id: "lectura_derechos", titulo: "02. Acta de Lectura de Derechos", archivo: "plantilla/acta_lectura_derechos.docx" },
  { id: "detencion", titulo: "03. Acta de Detención Policial", archivo: "plantilla/acta_detencion.docx" },
  { id: "buen_trato", titulo: "04. Constancia de Buen Trato", archivo: "plantilla/acta_buen_trato.docx" },
  { id: "sit_vehicular", titulo: "05. Acta de Situación Vehicular", archivo: "plantilla/acta_situacion_vehicular.docx" },
  { id: "reg_vehicular", titulo: "06. Acta de Registro Vehicular", archivo: "plantilla/acta_registro_vehicular.docx" },
  { id: "intervencion", titulo: "07. Acta de Intervención Policial", archivo: "plantilla/acta_intervencion.docx" },
  { id: "lacrado", titulo: "08. Acta de Lacrado / Cadena de Custodia", archivo: "plantilla/acta_lacrado.docx" },
  { id: "comunicacion", titulo: "09. Acta de Comunicación Telefónica", archivo: "plantilla/acta_comunicacion.docx" }
];

let delitoConfigurado = "";
let idsActasConfiguradas = [];

document.addEventListener('DOMContentLoaded', () => {
  // Cargar datos de menú
  delitoConfigurado = localStorage.getItem('pnp_delito_seleccionado') || "CONTROL DE IDENTIDAD POLICIAL";
  const actasJSON = localStorage.getItem('pnp_actas_seleccionadas');
  idsActasConfiguradas = actasJSON ? JSON.parse(actasJSON) : ["reg_personal"];

  // Mostrar resumen
  const resDelito = document.getElementById('resumenDelito');
  const resCant = document.getElementById('resumenActasCant');
  if (resDelito) resDelito.innerText = delitoConfigurado;
  if (resCant) resCant.innerText = `📄 ${idsActasConfiguradas.length} acta(s) seleccionada(s) para generar`;

  // Fecha y hora actual por defecto
  const fechaInput = document.getElementById('fecha');
  const hora1Input = document.getElementById('hora1');
  if (fechaInput) fechaInput.value = new Date().toISOString().split('T')[0];
  if (hora1Input) hora1Input.value = new Date().toTimeString().slice(0, 5);
});

// Generar Expediente
document.getElementById('expedienteForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const statusMsg = document.getElementById('statusMsg');
  statusMsg.className = "alert-msg alert-success";
  statusMsg.style.display = "block";
  statusMsg.innerText = `Procesando ${idsActasConfiguradas.length} acta(s)... Por favor espere.`;

  const actasAProcesar = CATALOGO_ACTAS.filter(acta => idsActasConfiguradas.includes(acta.id));

  if (actasAProcesar.length === 0) {
    alert("⚠️ No hay actas seleccionadas. Regrese al menú para configurar la intervención.");
    return;
  }

  // Recopilar datos
  const placaInput = document.getElementById('placa_vehiculo');
  const marcaInput = document.getElementById('marca_vehiculo');
  const modeloInput = document.getElementById('modelo_vehiculo');
  const colorInput = document.getElementById('color_vehiculo');

  const formData = {
    delito: delitoConfigurado,
    distrito: document.getElementById('distrito').value,
    provincia: document.getElementById('provincia').value,
    region: document.getElementById('region').value,
    fecha: document.getElementById('fecha').value,
    hora1: document.getElementById('hora1').value,
    hora2: document.getElementById('hora2').value,
    lugar: document.getElementById('lugar').value,
    intervenido_nombre: document.getElementById('intervenido_nombre').value,
    intervenido_dni: document.getElementById('intervenido_dni').value,
    edad: document.getElementById('edad').value,
    natural: document.getElementById('natural').value,
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

  try {
    // Guardar en Supabase (si está disponible)
    try {
      if (typeof supabaseClient !== 'undefined' && supabaseClient.from) {
        await supabaseClient.from('intervenciones').insert([{
          tipo_delito: delitoConfigurado,
          fecha: formData.fecha,
          hora: formData.hora1,
          lugar: formData.lugar,
          intervenido_nombre: formData.intervenido_nombre,
          intervenido_dni: formData.intervenido_dni,
          efectivo_cargo: `${formData.grado} ${formData.personal_interviniente}`
        }]);
      }
    } catch (errSupabase) {
      console.warn("Ejecutando en modo offline.");
    }

    // Generar documentos
    if (actasAProcesar.length === 1) {
      const acta = actasAProcesar[0];
      const blobDoc = await generarDocumentoWord(acta.archivo, formData);
      saveAs(blobDoc, `${acta.id}_${formData.intervenido_dni}.docx`);
    } else {
      const zip = new JSZip();
      for (let acta of actasAProcesar) {
        try {
          const blobDoc = await generarDocumentoWord(acta.archivo, formData);
          zip.file(`${acta.titulo}.docx`, blobDoc);
        } catch (err) {
          console.warn(`Plantilla no encontrada: ${acta.archivo}`);
        }
      }
      const zipContent = await zip.generateAsync({ type: "blob" });
      saveAs(zipContent, `Expediente_${formData.intervenido_dni}_${formData.fecha}.zip`);
    }

    statusMsg.innerText = "¡Expediente generado exitosamente!";

  } catch (err) {
    statusMsg.className = "alert-msg alert-danger";
    statusMsg.innerText = "Error al procesar expediente: " + err.message;
  }
});

// Función con detección robusta de PizZip y Docxtemplater + nullGetter anti-undefined
async function generarDocumentoWord(rutaPlantilla, datos) {
  const PizZipLib = window.PizZip || (typeof PizZip !== 'undefined' ? PizZip : null);
  const DocxLib = window.docxtemplater || (typeof docxtemplater !== 'undefined' ? docxtemplater : null);

  if (!PizZipLib) {
    throw new Error("No se pudo cargar la librería PizZip en el navegador.");
  }

  const response = await fetch(rutaPlantilla);
  if (!response.ok) {
    throw new Error(`No se encontró el archivo de la plantilla en: ${rutaPlantilla}`);
  }
  const arrayBuffer = await response.arrayBuffer();

  const zip = new PizZipLib(arrayBuffer);

  // nullGetter garantiza reemplazar etiquetas sin valor por texto vacío "" en vez de "undefined"
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
