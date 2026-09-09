// Protocolos predefinidos
const PROTOCOLOS = {
  ebriedad: {
    nombre: "Conducción en Estado de Ebriedad / Drogadicción",
    actas: [
      { id: "reg_personal", titulo: "01. Acta de Registro Personal", archivo: "plantilla/acta_registro_personal.docx" },
      { id: "lectura_derechos", titulo: "02. Acta de Lectura de Derechos", archivo: "plantilla/acta_lectura_derechos.docx" },
      { id: "detencion", titulo: "03. Acta de Detención", archivo: "plantilla/acta_detencion.docx" },
      { id: "buen_trato", titulo: "04. Constancia de Buen Trato", archivo: "plantilla/acta_buen_trato.docx" },
      { id: "sit_vehicular", titulo: "05. Acta de Situación Vehicular", archivo: "plantilla/acta_situacion_vehicular.docx" },
      { id: "intervencion", titulo: "06. Acta de Intervención Policial", archivo: "plantilla/acta_intervencion.docx" }
    ]
  },
  identidad: {
    nombre: "Control de Identidad Policial",
    actas: [
      { id: "intervencion", titulo: "01. Acta de Intervención Policial", archivo: "plantilla/acta_intervencion.docx" },
      { id: "reg_personal", titulo: "02. Acta de Registro Personal", archivo: "plantilla/acta_registro_personal.docx" }
    ]
  },
  flagrancia: {
    nombre: "Delito Común / Flagrancia",
    actas: [
      { id: "reg_personal", titulo: "01. Acta de Registro Personal", archivo: "plantilla/acta_registro_personal.docx" },
      { id: "lectura_derechos", titulo: "02. Acta de Lectura de Derechos", archivo: "plantilla/acta_lectura_derechos.docx" },
      { id: "detencion", titulo: "03. Acta de Detención", archivo: "plantilla/acta_detencion.docx" },
      { id: "buen_trato", titulo: "04. Constancia de Buen Trato", archivo: "plantilla/acta_buen_trato.docx" }
    ]
  },
  individual: {
    nombre: "Acta de Registro Personal Única",
    actas: [
      { id: "reg_personal", titulo: "01. Acta de Registro Personal", archivo: "plantilla/acta_registro_personal.docx" }
    ]
  }
};

let protocoloActual = null;

document.addEventListener('DOMContentLoaded', () => {
  const tipo = localStorage.getItem('protocolo_seleccionado') || 'individual';
  protocoloActual = PROTOCOLOS[tipo] || PROTOCOLOS.individual;

  // Cargar nombre y checklist en pantalla
  document.getElementById('protocoloNombre').innerText = "⚠️ Protocolo: " + protocoloActual.nombre;
  
  const checklistUI = document.getElementById('checklistContenedor');
  checklistUI.innerHTML = "";
  
  protocoloActual.actas.forEach((acta, index) => {
    checklistUI.innerHTML += `
      <li>
        <span class="badge-num">${index + 1}</span>
        <span>${acta.titulo}</span>
      </li>
    `;
  });

  // Fechas y horas automáticas
  document.getElementById('fecha').value = new Date().toISOString().split('T')[0];
  document.getElementById('hora1').value = new Date().toTimeString().slice(0, 5);
});

// Listener de envío
document.getElementById('expedienteForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const statusMsg = document.getElementById('statusMsg');
  statusMsg.className = "alert-msg alert-success";
  statusMsg.style.display = "block";
  statusMsg.innerText = "Procesando documentos del expediente...";

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
    // 1. Guardar log breve en Supabase
    await supabaseClient.from('intervenciones').insert([{
      tipo_delito: protocoloActual.nombre,
      fecha: formData.fecha,
      hora: formData.hora1,
      lugar: formData.lugar,
      intervenido_nombre: formData.intervenido_nombre,
      intervenido_dni: formData.intervenido_dni,
      efectivo_cargo: `${formData.grado} ${formData.personal_interviniente}`
    }]);

    // 2. Generar actas
    if (protocoloActual.actas.length === 1) {
      // Descarga archivo único
      const acta = protocoloActual.actas[0];
      const blobDoc = await generarDocumentoWord(acta.archivo, formData);
      saveAs(blobDoc, `Acta_Reg_Personal_${formData.intervenido_dni}.docx`);
    } else {
      // Descarga expediente completo en ZIP
      const zip = new JSZip();
      for (let acta of protocoloActual.actas) {
        try {
          const blobDoc = await generarDocumentoWord(acta.archivo, formData);
          zip.file(`${acta.titulo}.docx`, blobDoc);
        } catch(err) {
          console.warn(`No se encontró la plantilla: ${acta.archivo}`);
        }
      }
      const zipContent = await zip.generateAsync({ type: "blob" });
      saveAs(zipContent, `Expediente_${formData.intervenido_dni}_${formData.fecha}.zip`);
    }

    statusMsg.innerText = "¡Expediente generado exitosamente!";

  } catch(err) {
    statusMsg.className = "alert-msg alert-danger";
    statusMsg.innerText = "Error al procesar: " + err.message;
  }
});

// Función auxiliar para rellenar cada Word
async function generarDocumentoWord(rutaPlantilla, datos) {
  const response = await fetch(rutaPlantilla);
  if (!response.ok) throw new Error(`No se pudo cargar ${rutaPlantilla}`);
  const arrayBuffer = await response.arrayBuffer();
  
  const zip = new PizZip(arrayBuffer);
  const doc = new window.docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
  doc.render(datos);

  return doc.getZip().generate({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

function limpiarPantalla() {
  if (confirm("¿Deseas limpiar todos los campos para una nueva intervención?")) {
    document.getElementById('expedienteForm').reset();
    document.getElementById('fecha').value = new Date().toISOString().split('T')[0];
    document.getElementById('hora1').value = new Date().toTimeString().slice(0, 5);
  }
}
