// CATÁLOGO COMPLETO DE ACTAS DISPONIBLES EN EL SISTEMA
const CATALOGO_ACTAS = [
  { id: "reg_personal", titulo: "01. Acta de Registro Personal", archivo: "plantilla/acta_registro_personal.docx", ebriedad: true, flagrancia: true, identidad: true },
  { id: "lectura_derechos", titulo: "02. Acta de Lectura de Derechos", archivo: "plantilla/acta_lectura_derechos.docx", ebriedad: true, flagrancia: true, identidad: false },
  { id: "detencion", titulo: "03. Acta de Detención Policial", archivo: "plantilla/acta_detencion.docx", ebriedad: true, flagrancia: true, identidad: false },
  { id: "buen_trato", titulo: "04. Constancia de Buen Trato", archivo: "plantilla/acta_buen_trato.docx", ebriedad: true, flagrancia: true, identidad: false },
  { id: "sit_vehicular", titulo: "05. Acta de Situación Vehicular", archivo: "plantilla/acta_situacion_vehicular.docx", ebriedad: true, flagrancia: false, identidad: false },
  { id: "reg_vehicular", titulo: "06. Acta de Registro Vehicular", archivo: "plantilla/acta_registro_vehicular.docx", ebriedad: false, flagrancia: false, identidad: false },
  { id: "intervencion", titulo: "07. Acta de Intervención Policial", archivo: "plantilla/acta_intervencion.docx", ebriedad: true, flagrancia: true, identidad: true },
  { id: "lacrado", titulo: "08. Acta de Lacrado / Cadena de Custodia", archivo: "plantilla/acta_lacrado.docx", ebriedad: false, flagrancia: false, identidad: false },
  { id: "comunicacion", titulo: "09. Acta de Comunicación Telefónica", archivo: "plantilla/acta_comunicacion.docx", ebriedad: false, flagrancia: false, identidad: false }
];

document.addEventListener('DOMContentLoaded', () => {
  const tipoProtocolo = localStorage.getItem('protocolo_seleccionado') || 'ebriedad';
  const contenedorUI = document.getElementById('checklistContenedor');
  const protocoloNombre = document.getElementById('protocoloNombre');

  // Ajustar título dinámico según selección del menú
  if (protocoloNombre) {
    const nombresProtocolos = {
      ebriedad: "Conducción en Estado de Ebriedad / Drogadicción",
      identidad: "Control de Identidad Policial",
      flagrancia: "Delito Común / Flagrancia Delictiva",
      individual: "Selección Manual de Actas"
    };
    protocoloNombre.innerText = "📋 Protocolo: " + (nombresProtocolos[tipoProtocolo] || "General");
  }

  // Generar las casillas (checkboxes) interactivas en pantalla
  if (contenedorUI) {
    contenedorUI.innerHTML = "";

    CATALOGO_ACTAS.forEach((acta) => {
      let estaMarcada = false;
      
      // Activar check por defecto según el protocolo elegido en el menú
      if (tipoProtocolo === 'ebriedad' && acta.ebriedad) estaMarcada = true;
      if (tipoProtocolo === 'identidad' && acta.identidad) estaMarcada = true;
      if (tipoProtocolo === 'flagrancia' && acta.flagrancia) estaMarcada = true;
      if (tipoProtocolo === 'individual' && acta.id === 'reg_personal') estaMarcada = true;

      contenedorUI.innerHTML += `
        <label style="display: flex; align-items: center; gap: 10px; font-weight: normal; cursor: pointer; background: #fff; padding: 8px 12px; border-radius: 5px; border: 1px solid #cbd5e1;">
          <input type="checkbox" id="chk_${acta.id}" value="${acta.id}" ${estaMarcada ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer;">
          <span style="font-size: 13px;">📄 <strong>${acta.titulo}</strong></span>
        </label>
      `;
    });
  }

  // Establecer fecha y hora actual automáticamente
  const fechaInput = document.getElementById('fecha');
  const hora1Input = document.getElementById('hora1');
  if (fechaInput) fechaInput.value = new Date().toISOString().split('T')[0];
  if (hora1Input) hora1Input.value = new Date().toTimeString().slice(0, 5);
});

// Botones de apoyo para Seleccionar o Deseleccionar todo rápido
function marcarTodas(estado) {
  CATALOGO_ACTAS.forEach(acta => {
    const chk = document.getElementById(`chk_${acta.id}`);
    if (chk) chk.checked = estado;
  });
}

// Procesar y Generar Expediente al enviar formulario
document.getElementById('expedienteForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // 1. Obtener únicamente las actas que tienen el check marcado (☑️)
  const actasAProcesar = CATALOGO_ACTAS.filter(acta => {
    const chk = document.getElementById(`chk_${acta.id}`);
    return chk && chk.checked;
  });

  if (actasAProcesar.length === 0) {
    alert("⚠️ Por favor selecciona al menos una (01) acta para generar.");
    return;
  }

  const statusMsg = document.getElementById('statusMsg');
  statusMsg.className = "alert-msg alert-success";
  statusMsg.style.display = "block";
  statusMsg.innerText = `Generando ${actasAProcesar.length} documento(s)... Por favor espere.`;

  // 2. Recopilar los datos cargados en las casillas del formulario
  const placaInput = document.getElementById('placa_vehiculo');
  const marcaInput = document.getElementById('marca_vehiculo');
  const colorInput = document.getElementById('color_vehiculo');

  const formData = {
    distrito: document.getElementById('distrito').value,
    provincia: document.getElementById('provincia').value,
    region: document.getElementById('provincia').value,
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
    
    // Campos vehiculares con valor por defecto si están vacíos
    placa_vehiculo: placaInput ? (placaInput.value || "NO REGISTRA") : "NO REGISTRA",
    marca_vehiculo: marcaInput ? (marcaInput.value || "NO REGISTRA") : "NO REGISTRA",
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
    // 3. Registrar bitácora en Supabase (si hay conexión a internet)
    try {
      if (typeof supabaseClient !== 'undefined') {
        await supabaseClient.from('intervenciones').insert([{
          tipo_delito: `Expediente (${actasAProcesar.length} actas)`,
          fecha: formData.fecha,
          hora: formData.hora1,
          lugar: formData.lugar,
          intervenido_nombre: formData.intervenido_nombre,
          intervenido_dni: formData.intervenido_dni,
          efectivo_cargo: `${formData.grado} ${formData.personal_interviniente}`
        }]);
      }
    } catch (errSupabase) {
      console.warn("Aviso: Ejecutando en modo offline o sin conexión a Supabase.");
    }

    // 4. Descarga de archivos según la cantidad de actas seleccionadas
    if (actasAProcesar.length === 1) {
      // Descarga directa en .docx si es una sola acta
      const acta = actasAProcesar[0];
      const blobDoc = await generarDocumentoWord(acta.archivo, formData);
      saveAs(blobDoc, `${acta.id}_${formData.intervenido_dni}.docx`);
    } else {
      // Descarga comprimida en .ZIP si son varias actas
      const zip = new JSZip();
      for (let acta of actasAProcesar) {
        try {
          const blobDoc = await generarDocumentoWord(acta.archivo, formData);
          zip.file(`${acta.titulo}.docx`, blobDoc);
        } catch (err) {
          console.warn(`Plantilla no encontrada en GitHub: ${acta.archivo}`);
        }
      }
      const zipContent = await zip.generateAsync({ type: "blob" });
      saveAs(zipContent, `Expediente_${formData.intervenido_dni}_${formData.fecha}.zip`);
    }

    statusMsg.innerText = "¡Expediente generado exitosamente!";

  } catch (err) {
    statusMsg.className = "alert-msg alert-danger";
    statusMsg.innerText = "Error al procesar el expediente: " + err.message;
  }
});

// Función auxiliar para descargar y rellenar la plantilla de Word
async function generarDocumentoWord(rutaPlantilla, datos) {
  const response = await fetch(rutaPlantilla);
  if (!response.ok) {
    throw new Error(`No se pudo cargar la plantilla desde la ruta: ${rutaPlantilla}`);
  }
  const arrayBuffer = await response.arrayBuffer();

  const zip = new PizZip(arrayBuffer);
  const doc = new window.docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
  
  doc.render(datos);

  return doc.getZip().generate({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

// Limpiar formulario para nuevo intervenido
function limpiarPantalla() {
  if (confirm("¿Deseas limpiar la pantalla para registrar un nuevo intervenido?")) {
    document.getElementById('expedienteForm').reset();
    const fechaInput = document.getElementById('fecha');
    const hora1Input = document.getElementById('hora1');
    if (fechaInput) fechaInput.value = new Date().toISOString().split('T')[0];
    if (hora1Input) hora1Input.value = new Date().toTimeString().slice(0, 5);
  }
}
