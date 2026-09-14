/**
 * CATALOGO MASTER DE ACTAS PNP (SISTEMA DE GESTIÓN DE EXPEDIENTES POLICIALES)
 * Archivo: js/word.js
 */

const CATALOGO_ACTAS = [
  { 
    id: "acta_intervencion", 
    aliases: ["intervencion", "acta_intervencion", "01_ACTA_DE_INTERVENCION_POLICIAL"], 
    titulo: "01. Acta de Intervención Policial", 
    archivo: "plantilla/acta_intervencion.docx", 
    llevaHora: true, 
    esIndividual: false 
  },
  { 
    id: "acta_registro_personal", 
    aliases: ["reg_personal", "acta_registro_personal", "registro_personal", "ACTA_DE_REGISTRO_PERSONAL"], 
    titulo: "02. Acta de Registro Personal", 
    archivo: "plantilla/acta_registro_personal.docx", 
    llevaHora: true, 
    esIndividual: true 
  },
  { 
    id: "acta_lectura_derechos", 
    aliases: ["lectura_derechos", "acta_lectura_derechos", "ACTA_DE_LECTURA_DE_DERECHOS"], 
    titulo: "03. Acta de Lectura de Derechos", 
    archivo: "plantilla/acta_lectura_derechos.docx", 
    llevaHora: true, 
    esIndividual: true 
  },
  { 
    id: "acta_detencion", 
    aliases: ["detencion", "acta_detencion", "ACTA_DE_DETENCION_POLICIAL"], 
    titulo: "04. Acta de Detención Policial", 
    archivo: "plantilla/acta_detencion.docx", 
    llevaHora: true, 
    esIndividual: true 
  },
  { 
    id: "acta_buen_trato", 
    aliases: ["buen_trato", "constancia_buen_trato", "buentrato", "acta_buen_trato", "CONSTANCIA_DE_BUEN_TRATO"], 
    titulo: "05. Constancia de Buen Trato e Integridad Física", 
    archivo: "plantilla/acta_buen_trato.docx", 
    llevaHora: false, 
    esIndividual: true 
  },
  { 
    id: "acta_registro_vehicular", 
    aliases: ["reg_vehicular", "acta_registro_vehicular", "registro_vehicular", "ACTA_DE_REGISTRO_VEHICULAR"], 
    titulo: "06. Acta de Registro Vehicular", 
    archivo: "plantilla/acta_registro_vehicular.docx", 
    llevaHora: true, 
    esIndividual: true,
    esVehicular: true 
  },
  { 
    id: "acta_inmovilizacion", 
    aliases: ["acta_inmovilizacion", "inmovilizacion"], 
    titulo: "07. Acta de Inmovilización", 
    archivo: "plantilla/acta_inmovilizacion.docx", 
    llevaHora: true, 
    esIndividual: true,
    esVehicular: true 
  },
  { 
    id: "acta_incautacion", 
    aliases: ["acta_incautacion", "incautacion"], 
    titulo: "08. Acta de Incautación", 
    archivo: "plantilla/acta_incautacion.docx", 
    llevaHora: true, 
    esIndividual: true 
  },
  { 
    id: "acta_lacrado_cadena_custodia", 
    aliases: ["lacrado", "acta_lacrado_cadena_custodia", "ACTA_DE_LACRADO_CADENA_CUSTODIA"], 
    titulo: "09. Acta de Lacrado y Cadena de Custodia", 
    archivo: "plantilla/acta_lacrado_cadena_custodia.docx", 
    llevaHora: true, 
    esIndividual: true 
  },
  { 
    id: "formato_A-6_rotulo_indicios_evidencias", 
    aliases: ["formato_A-6_rotulo_indicios_evidencias", "rotulo", "indicios"], 
    titulo: "10. Formato A-6 Rótulo de Indicios y Evidencias", 
    archivo: "plantilla/formato_A-6_rotulo_indicios_evidencias.docx", 
    llevaHora: true, 
    esIndividual: true 
  },
  { 
    id: "acta_hallazgo_recojo", 
    aliases: ["hallazgo_recojo", "acta_hallazgo_recojo", "ACTA_DE_HALLAZGO_Y_RECOJO"], 
    titulo: "11. Acta de Hallazgo y Recojo", 
    archivo: "plantilla/acta_hallazgo_recojo.docx", 
    llevaHora: true, 
    esIndividual: false 
  },
  { 
    id: "acta_ocurrencia", 
    aliases: ["acta_ocurrencia", "ocurrencia"], 
    titulo: "12. Acta de Ocurrencia", 
    archivo: "plantilla/acta_ocurrencia.docx", 
    llevaHora: true, 
    esIndividual: false 
  },
  { 
    id: "acta_intervencion_control_identidad", 
    aliases: ["acta_intervencion_control_identidad", "control_identidad"], 
    titulo: "13. Acta de Intervención y Control de Identidad", 
    archivo: "plantilla/acta_intervencion_control_identidad.docx", 
    llevaHora: true, 
    esIndividual: true 
  },
  { 
    id: "acta_constatacion", 
    aliases: ["acta_constatacion", "constatacion"], 
    titulo: "14. Acta de Constatación", 
    archivo: "plantilla/acta_constatacion.docx", 
    llevaHora: true, 
    esIndividual: true 
  },
  { 
    id: "acta_situacion_vehicular", 
    aliases: ["acta_situacion_vehicular", "situacion_vehicular", "acta_s_v", "acta_s_v_vehiculo_mayor", "acta_s_v_vehiculo_menor", "ACTA_DE_SITUACION_VEHICULAR"], 
    titulo: "15. Acta de Situación Vehicular", 
    archivo: "plantilla/acta_s_v_vehiculo_mayor.docx", 
    llevaHora: true, 
    esIndividual: true,
    esVehicular: true 
  }
];

let actasManualesAdicionales = [];
let delitoConfigurado = "";
let idsActasConfiguradas = [];

let actasAProcesarSecuencia = [];
let indiceActaActual = 0;
let datosFormularioBase = {};
let horariosPorActa = {};

function obtenerRutaArchivoActa(acta, vehiculo) {
  const idLimpio = (acta.id || '').toLowerCase();
  const esSituacionVehicular = idLimpio.includes('situacion_vehicular') || idLimpio.includes('s_v');

  if (esSituacionVehicular) {
    const claseRaw = (vehiculo && (vehiculo.clase_vehiculo || vehiculo.clase)) ? (vehiculo.clase_vehiculo || vehiculo.clase) : '';
    const claseUpper = claseRaw.toUpperCase().trim();
    const palabrasVehiculoMenor = ['TRIMOVIL', 'MOTOCICLETA', 'MOTOTAXI', 'MOTOCAR', 'MOTO', 'CUATRIMOTO', 'TRICICLO'];

    const esVehiculoMenor = palabrasVehiculoMenor.some(tipo => claseUpper.includes(tipo));

    return esVehiculoMenor 
      ? 'plantilla/acta_s_v_vehiculo_menor.docx' 
      : 'plantilla/acta_s_v_vehiculo_mayor.docx';
  }

  return acta.archivo;
}

function registrarActaManual(nuevaActa) {
  if (!nuevaActa.id || !nuevaActa.titulo) {
    console.error("⚠️ El acta manual requiere al menos 'id' y 'titulo'.");
    return;
  }

  const nombreArchivo = `${nuevaActa.id}.docx`;
  const estructuraCompleta = {
    id: nuevaActa.id,
    aliases: [nuevaActa.id, nuevaActa.id.toLowerCase()],
    titulo: nuevaActa.titulo,
    archivo: nuevaActa.archivo || `plantilla/${nombreArchivo}`,
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

function obtenerTipoEmbalajeFinal() {
  const selElem = document.getElementById('tipo_embalaje');
  const sel = selElem ? selElem.value : '';
  if (sel === 'OTRO') {
    const manualElem = document.getElementById('tipo_embalaje_manual');
    const manual = manualElem ? manualElem.value.trim() : '';
    return manual !== '' ? manual : 'un embalaje no especificado';
  }
  return sel || 'una bolsa plástica transparente de seguridad';
}

function obtenerConstanciaTestigoFinal() {
  const opcElem = document.getElementById('opcion_constancia_testigo');
  const opc = opcElem ? opcElem.value : 'OFICINA';
  const motivo = document.getElementById('motivo_justificatorio') ? document.getElementById('motivo_justificatorio').value : '';

  if (opc === 'OFICINA') {
    return `Cabe señalar que la presente diligencia se realizó en las instalaciones de la dependencia policial, ${motivo}`;
  } else if (opc === 'LUGAR_SIN_TESTIGO') {
    return `Cabe señalar que la presente diligencia se realizó en el lugar de la intervención; precisando que los transeúntes y personas presentes en las inmediaciones se negaron a participar o firmar en calidad de testigos por temor a represalias o comprometerse, dejándose constancia fehaciente de dicha circunstancia conforme a ley.`;
  }
  return `Se deja constancia de que la presente diligencia se desarrolló conforme a los procedimientos y disposiciones legales vigentes.`;
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

function obtenerListaEfectivosPNPForm() {
  if (typeof obtenerListaEfectivosPNP === 'function') {
    const lista = obtenerListaEfectivosPNP();
    if (lista && lista.length > 0) return lista;
  }

  if (window.pnp_lista_efectivos && window.pnp_lista_efectivos.length > 0) {
    return window.pnp_lista_efectivos;
  }

  const local = localStorage.getItem('pnp_lista_efectivos');
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (parsed && parsed.length > 0) return parsed;
    } catch (e) {}
  }

  const getValSafe = (id) => document.getElementById(id) ? document.getElementById(id).value.trim() : "";
  const grado = getValSafe('grado') || getValSafe('pnp_grado_1') || "S3";
  const nombre = getValSafe('personal_interviniente') || getValSafe('pnp_nombre_1') || "ARMANDO VIVANCO CURO";
  const cip = getValSafe('cip') || getValSafe('pnp_cip_1') || "31425556";

  return [{ grado, nombre, cip }];
}

function obtenerTextoEfectivosNarrativa(lista) {
  if (!lista || lista.length === 0) return "el personal policial interviniente";
  if (lista.length === 1) {
    return `el personal policial interviniente **${lista[0].grado} PNP ${lista[0].nombre}** (CIP N° ${lista[0].cip})`;
  }
  const partes = lista.map(e => `**${e.grado} PNP ${e.nombre}** (CIP N° ${e.cip})`);
  const ultimo = partes.pop();
  return `el personal policial interviniente ${partes.join(', ')} y ${ultimo}`;
}

function generarBloqueFirmasPNP(lista) {
  if (!lista || lista.length === 0) return "";
  let bloque = "";
  lista.forEach((pnp) => {
    bloque += 
      `__________________________________\n` +
      `EL PERSONAL POLICIAL INTERVINIENTE\n` +
      `${pnp.grado} PNP ${pnp.nombre}\n` +
      `CIP N° ${pnp.cip}\n\n`;
  });
  return bloque;
}

function obtenerTextoVehiculosPoliciales() {
  const cantVehElem = document.getElementById('cant_vehiculos_pnp');
  const cantVeh = cantVehElem ? (parseInt(cantVehElem.value, 10) || 1) : 1;
  const placas = [];

  for (let i = 1; i <= cantVeh; i++) {
    const inputElem = document.getElementById(`placa_policial_${i}`);
    const val = inputElem ? inputElem.value.trim() : "";
    if (val) placas.push(val);
  }

  if (placas.length === 0) {
    return "a bordo de la U.M. de placa S/P";
  } else if (placas.length === 1) {
    return `a bordo de la U.M. de placa N° ${placas[0]}`;
  } else {
    const ultimo = placas.pop();
    return `a bordo de las U.M. de placas N° ${placas.join(', N° ')} y N° ${ultimo}`;
  }
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

  const getValSafe = (id) => document.getElementById(id) ? document.getElementById(id).value.trim() : "";
  const nom = getValSafe('intervenido_nombre') || getValSafe('intervenido_nombre_1');
  const dniVal = getValSafe('intervenido_dni') || getValSafe('intervenido_dni_1');

  return [{
    nombre: nom || "PERSONA EN PROCESO DE IDENTIFICACIÓN",
    dni: dniVal || "S/D",
    licencia: getValSafe('licencia') || getValSafe('licencia_1') || "________",
    categoria_licencia: getValSafe('categoria_licencia') || getValSafe('categoria_licencia_1') || "____",
    edad: getValSafe('edad') || getValSafe('edad_1') || "--",
    estado_civil: getValSafe('estado_civil') || getValSafe('estado_civil_1') || "SOLTERO(A)",
    natural: getValSafe('natural') || getValSafe('natural_1') || "PERUANA",
    celular: getValSafe('celular1') || getValSafe('celular1_1') || "S/N",
    papa: getValSafe('papa') || getValSafe('papa_1') || "S/D",
    mama: getValSafe('mama') || getValSafe('mama_1') || "S/D",
    ocupacion: getValSafe('ocupacion') || getValSafe('ocupacion_1') || "NO ESPECIFICA",
    domicilio: getValSafe('domicilio') || getValSafe('domicilio_1') || "NO ESPECIFICA",
    asistido_confianza: getValSafe('asistido_confianza') || getValSafe('asistido_confianza_1'),
    asistido_confianza_registro: getValSafe('asistido_confianza_registro') || getValSafe('asistido_confianza_registro_1')
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
  const clase_vehiculo = getValSafe('clase_vehiculo_1') || getValSafe('clase_vehiculo') || "TRIMOVIL";
  const marca = getValSafe('marca_vehiculo_1') || getValSafe('marca_vehiculo') || "NO REGISTRA";
  const modelo = getValSafe('modelo_vehiculo_1') || getValSafe('modelo_vehiculo') || "NO REGISTRA";
  const color = getValSafe('color_vehiculo_1') || getValSafe('color_vehiculo') || "NO REGISTRA";
  const anio_fab = getValSafe('anio_fab_vehiculo_1') || getValSafe('anio_fab') || "NO REGISTRA";
  const num_motor = getValSafe('num_motor_vehiculo_1') || getValSafe('num_motor') || "NO REGISTRA";
  const num_chasis = getValSafe('num_chasis_vehiculo_1') || getValSafe('num_chasis') || "NO REGISTRA";

  return [{ placa, clase_vehiculo, marca, modelo, color, anio_fab, num_motor, num_chasis }];
}

function construirTextoVehiculosResumen(listaVehiculos) {
  if (!listaVehiculos || listaVehiculos.length === 0) return "NO REGISTRA";
  if (listaVehiculos.length === 1) {
    const v = listaVehiculos[0];
    return `el vehículo de placa N° ${v.placa} (Clase: ${v.clase_vehiculo || 'TRIMOVIL'}, Marca: ${v.marca}, Modelo: ${v.modelo}, Color/Estado: ${v.color})`;
  }
  const partes = listaVehiculos.map(v => `el vehículo de placa N° ${v.placa} (${v.clase_vehiculo || 'TRIMOVIL'} ${v.marca} ${v.modelo})`);
  const ultimo = partes.pop();
  return `${partes.join(', ')} y ${ultimo}`;
}

function obtenerTextoFiliacionCompletaMultiples(lista) {
  if (!lista || lista.length === 0) return "No registra intervenidos.";
  return lista.map((item, idx) => {
    const prefijo = lista.length > 1 ? `INTERVENIDO N° ${idx + 1}: ` : '';
    return `${prefijo}${item.nombre}, con ${item.edad} años de edad, natural de ${item.natural}, de ocupación ${item.ocupacion}, identificado con DNI N° ${item.dni}, L/C N° ${item.licencia || '________'} (Cat. ${item.categoria_licencia || '____'}), quien refiere domiciliar en ${item.domicilio}, celular N° ${item.celular || 'S/N'}, estado civil ${item.estado_civil}, hijo de don ${item.papa || 'S/D'} y doña ${item.mama || 'S/D'}.`;
  }).join('\n\n');
}

function generarBloqueCierreYFirmas(horaFin, lista) {
  let textoCierre = `\n--- Siendo las ${horaFin} Horas del mismo día se dio por concluida la presente diligencia, firmando los participantes en señal de conformidad. -------------------\n\n` +
    `Se adjunta:\n` +
    `${typeof obtenerListaAdjuntosFormateada === 'function' ? obtenerListaAdjuntosFormateada() : ''}\n\n\n`;

  if (!lista || lista.length <= 1) {
    const int1 = (lista && lista[0]) ? lista[0] : { nombre: '{intervenido_nombre}', dni: '{intervenido_dni}' };
    textoCierre += 
      `                                        __________________________________\n` +
      `                                                  EL INTERVENIDO\n\n` +
      `                                        Nombre: ${int1.nombre}\n` +
      `                                        DNI N°: ${int1.dni}`;
  } else {
    lista.forEach((item, idx) => {
      textoCierre += 
        `                                        __________________________________\n` +
        `                                                  EL INTERVENIDO N° ${idx + 1}\n\n` +
        `                                        Nombre: ${item.nombre}\n` +
        `                                        DNI N°: ${item.dni}\n\n`;
    });
  }

  return textoCierre;
}

document.addEventListener('DOMContentLoaded', () => {
  delitoConfigurado = localStorage.getItem('pnp_delito_seleccionado') || "DILIGENCIA POLICIAL INDEPENDIENTE";
  const actasJSON = localStorage.getItem('pnp_actas_seleccionadas');
  idsActasConfiguradas = actasJSON ? JSON.parse(actasJSON) : ["acta_constatacion"];

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
  if (fechaInput && !fechaInput.value) fechaInput.value = new Date().toISOString().split('T')[0];
  if (hora1Input && !hora1Input.value) hora1Input.value = new Date().toTimeString().slice(0, 5);
});

const formExpediente = document.getElementById('expedienteForm');
if (formExpediente) {
  formExpediente.addEventListener('submit', async (e) => {
    e.preventDefault();

    actasAProcesarSecuencia = [];
    
    idsActasConfiguradas.forEach(idSel => {
      const idLimpio = (typeof idSel === 'object' && idSel !== null) ? idSel.id : idSel;
      
      let coincide = CATALOGO_ACTAS.find(acta => 
        acta.id === idLimpio || acta.aliases.includes(idLimpio)
      );

      if (!coincide) {
        const nombreArchivo = `${idLimpio}.docx`;
        coincide = {
          id: idLimpio,
          aliases: [idLimpio],
          titulo: (typeof idSel === 'object' && idSel.titulo) ? idSel.titulo : `Acta de ${idLimpio}`,
          archivo: `plantilla/${nombreArchivo}`,
          llevaHora: true,
          esIndividual: true,
          esVehicular: idLimpio.includes('vehicular') || idLimpio.includes('s_v')
        };
      }

      actasAProcesarSecuencia.push(coincide);
    });

    if (actasAProcesarSecuencia.length === 0) {
      alert(`⚠️ No se encontraron coincidencias para las actas seleccionadas.`);
      return;
    }

    const fechaRaw = document.getElementById('fecha').value;
    const listaEfectivosPNP = obtenerListaEfectivosPNPForm();
    const pnpPrincipal = listaEfectivosPNP[0] || { grado: "S3", nombre: "ARMANDO VIVANCO CURO", cip: "31425556" };

    const listaVehiculos = obtenerListaVehiculosForm();
    const vehPrincipal = listaVehiculos[0] || { placa: "NO REGISTRA", clase_vehiculo: "TRIMOVIL", marca: "NO REGISTRA", modelo: "NO REGISTRA", color: "NO REGISTRA" };

    datosFormularioBase = {
      delito: delitoConfigurado,
      distrito: document.getElementById('distrito') ? document.getElementById('distrito').value : "Huanta",
      provincia: document.getElementById('provincia') ? document.getElementById('provincia').value : "Huanta",
      region: document.getElementById('region') ? document.getElementById('region').value : "Ayacucho",
      fecha: formatearFechaPolicial(fechaRaw),
      lugar: document.getElementById('lugar') ? document.getElementById('lugar').value : "",

      agraviado: document.getElementById('agraviado') ? document.getElementById('agraviado').value.trim() : "EL ESTADO",
      motivo_justificatorio: document.getElementById('motivo_justificatorio') ? document.getElementById('motivo_justificatorio').value : "",
      unidad_policial: document.getElementById('unidad_policial') ? document.getElementById('unidad_policial').value : "UTSEVI PNP HUANTA",
      unidad_disposicion: document.getElementById('unidad_disposicion') ? document.getElementById('unidad_disposicion').value : "SIAT-COM PNP HUANTA",

      resultado_esinpol: document.getElementById('resultado_esinpol') ? document.getElementById('resultado_esinpol').value : "NEGATIVO",
      tipo_requisitoria: document.getElementById('tipo_requisitoria') ? document.getElementById('tipo_requisitoria').value : "",
      motivo_requisitoria: document.getElementById('motivo_requisitoria') ? document.getElementById('motivo_requisitoria').value : "",
      juzgado_requisitoria: document.getElementById('juzgado_requisitoria') ? document.getElementById('juzgado_requisitoria').value : "",
      documento_requisitoria: document.getElementById('documento_requisitoria') ? document.getElementById('documento_requisitoria').value : "",
      fecha_requisitoria: document.getElementById('fecha_requisitoria') ? formatearFechaPolicial(document.getElementById('fecha_requisitoria').value) : "",
      situacion_requisitoria: document.getElementById('situacion_requisitoria') ? document.getElementById('situacion_requisitoria').value : "",

      placa_vehiculo: vehPrincipal.placa,
      clase_vehiculo: vehPrincipal.clase_vehiculo,
      marca_vehiculo: vehPrincipal.marca,
      modelo_vehiculo: vehPrincipal.modelo,
      color_vehiculo: vehPrincipal.color,
      anio_fab_vehiculo: vehPrincipal.anio_fab || "NO REGISTRA",
      num_motor_vehiculo: vehPrincipal.num_motor || "NO REGISTRA",
      num_chasis_vehiculo: vehPrincipal.num_chasis || "NO REGISTRA",
      vehiculos_resumen: construirTextoVehiculosResumen(listaVehiculos),

      drogas: document.getElementById('drogas') ? document.getElementById('drogas').value : "NEGATIVO",
      moneda: document.getElementById('moneda') ? document.getElementById('moneda').value : "NEGATIVO",
      joyas: document.getElementById('joyas') ? document.getElementById('joyas').value : "NEGATIVO",
      municion: document.getElementById('municion') ? document.getElementById('municion').value : "NEGATIVO",
      otros: document.getElementById('otros') ? document.getElementById('otros').value : "NEGATIVO",
      narrar_positivo: document.getElementById('narrar_positivo') ? document.getElementById('narrar_positivo').value : "NINGUNO",
      
      tipo_embalaje: obtenerTipoEmbalajeFinal(),
      forma_lacrado: (document.getElementById('forma_lacrado') && document.getElementById('forma_lacrado').value.trim() !== "") ? document.getElementById('forma_lacrado').value.trim() : "cinta adhesiva de seguridad y sellado térmico",
      constancia_testigo: obtenerConstanciaTestigoFinal(),

      detalle_hallazgo: (document.getElementById('detalle_hallazgo') && document.getElementById('detalle_hallazgo').value.trim() !== "") ? document.getElementById('detalle_hallazgo').value.trim() : "un (01) bien u objeto no especificado",
      circunstancia_hallazgo: (document.getElementById('circunstancia_hallazgo') && document.getElementById('circunstancia_hallazgo').value.trim() !== "") ? document.getElementById('circunstancia_hallazgo').value.trim() : "se procedió a la verificación del lugar de los hechos",

      personal_interviniente: pnpPrincipal.nombre,
      grado: pnpPrincipal.grado,
      cip: pnpPrincipal.cip
    };

    indiceActaActual = 0;
    horariosPorActa = {};

    const horaInicialBase = document.getElementById('hora1') ? document.getElementById('hora1').value : "08:00";
    avanzarAoSaltarAQuienLleveHora(horaInicialBase || "08:00");
  });
}

function avanzarAoSaltarAQuienLleveHora(horaSugeridaInicio) {
  while (indiceActaActual < actasAProcesarSecuencia.length) {
    const actaActual = actasAProcesarSecuencia[indiceActaActual];
    
    if (actaActual.id === "acta_buen_trato" || actaActual.llevaHora === false) {
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
  
  if (!modalElem) {
    const acta = actasAProcesarSecuencia[index];
    const horaTerminoSugerida = sumarMinutosAHora(horaSugeridaInicio, 5);
    horariosPorActa[acta.id] = {
      horaInicio: horaSugeridaInicio,
      horaTermino: horaTerminoSugerida
    };
    indiceActaActual++;
    const siguienteSugerida = sumarMinutosAHora(horaTerminoSugerida, 1);
    avanzarAoSaltarAQuienLleveHora(siguienteSugerida);
    return;
  }

  const acta = actasAProcesarSecuencia[index];
  const total = actasAProcesarSecuencia.length;

  const titElem = document.getElementById('modalHorasTitulo');
  const subElem = document.getElementById('modalHorasSubtitulo');
  if (titElem) titElem.innerText = `⏰ Horario (${index + 1}/${total}): ${acta.titulo}`;
  if (subElem) subElem.innerText = `Especifique hora de inicio y término para "${acta.titulo}":`;

  const horaTerminoSugerida = sumarMinutosAHora(horaSugeridaInicio, 5);

  const hIniElem = document.getElementById('modalHoraInicio');
  const hFinElem = document.getElementById('modalHoraTermino');
  if (hIniElem) hIniElem.value = horaSugeridaInicio;
  if (hFinElem) hFinElem.value = horaTerminoSugerida;

  const btnSiguiente = document.getElementById('btnSiguienteHora');
  if (btnSiguiente) {
    const quedanMasConHora = actasAProcesarSecuencia.slice(index + 1).some(a => a.id !== "acta_buen_trato" && a.llevaHora !== false);
    if (!quedanMasConHora) {
      btnSiguiente.innerHTML = "📦 Generar Documento(s)";
      btnSiguiente.className = "btn btn-success";
    } else {
      btnSiguiente.innerHTML = "Siguiente ➡️";
      btnSiguiente.className = "btn btn-primary";
    }
  }

  modalElem.style.display = 'flex';
}

function cancelarProcesoHoras() {
  const modalElem = document.getElementById('modalHoras');
  if (modalElem) modalElem.style.display = 'none';
}

async function confirmarHoraActaActual() {
  const hInicio = document.getElementById('modalHoraInicio') ? document.getElementById('modalHoraInicio').value : "";
  const hTermino = document.getElementById('modalHoraTermino') ? document.getElementById('modalHoraTermino').value : "";

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

async function ejecutarGeneracionFinalExpediente() {
  const statusMsg = document.getElementById('statusMsg');
  if (statusMsg) {
    statusMsg.className = "alert-msg alert-success";
    statusMsg.style.display = "block";
    statusMsg.innerText = `Procesando actas e individualizando intervenidos, vehículos y personal PNP... Por favor espere.`;
  }

  try {
    const regPersonal = horariosPorActa['acta_registro_personal'] || { horaInicio: "08:00", horaTermino: "08:05" };
    const lecturaDerechos = horariosPorActa['acta_lectura_derechos'] || { horaInicio: "08:06", horaTermino: "08:11" };
    const detencionHorario = horariosPorActa['acta_detencion'] || { horaInicio: "08:12", horaTermino: "08:17" };

    const hora5Val = detencionHorario.horaInicio || sumarMinutosAHora(lecturaDerechos.horaTermino, 1);
    const hora6Val = detencionHorario.horaTermino || sumarMinutosAHora(hora5Val, 5);
    const horaDetencionVal = sumarMinutosAHora(hora6Val, 2);

    const horaIntElem = document.getElementById('hora_intervencion');
    const horaIntVal = horaIntElem ? horaIntElem.value : regPersonal.horaInicio;

    const fiscalElem = document.getElementById('fiscal');
    const fiscalVal = fiscalElem ? (fiscalElem.value.trim() || "RMP NO ESPECIFICADO") : "RMP NO ESPECIFICADO";

    const agraviadoElem = document.getElementById('agraviado');
    const agraviadoVal = agraviadoElem ? (agraviadoElem.value.trim() || "EL ESTADO") : "EL ESTADO";

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

    const listaEfectivosPNP = obtenerListaEfectivosPNPForm();
    const listaIntervenidos = obtenerListaIntervenidosForm();
    const listaVehiculos = obtenerListaVehiculosForm();

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
    const horaTerminoTotal = horariosPorActa['acta_intervencion']?.horaTermino || datosFormularioBase.hora2 || "08:30";
    const horaPruebaG = sumarMinutosAHora(horaIntVal, 15);
    const bloqueFirmasG = generarBloqueCierreYFirmas(horaTerminoTotal, listaIntervenidos);

    const resultadoSituacionVehicular = localStorage.getItem('pnp_acta_situacion_vehicular_resultado') || "NO REGISTRA INSPECCIÓN GRÁFICA";

    const datosFinalesBase = {
      ...datosFormularioBase,
      ...vehiculosPNPObj,
      ...seccionesObj,
      
      vehiculos_policiales_texto: obtenerTextoVehiculosPoliciales(),

      intervenido_nombre: listaIntervenidos[0]?.nombre || "",
      intervenido_dni: listaIntervenidos[0]?.dni || "",
      licencia: listaIntervenidos[0]?.licencia || "________",
      categoria_licencia: listaIntervenidos[0]?.categoria_licencia || "____",
      edad: listaIntervenidos[0]?.edad || "",
      estado_civil: listaIntervenidos[0]?.estado_civil || "",
      natural: listaIntervenidos[0]?.natural || "",
      celular1: listaIntervenidos[0]?.celular || "S/N",
      papa: listaIntervenidos[0]?.papa || "S/D",
      mama: listaIntervenidos[0]?.mama || "S/D",
      ocupacion: listaIntervenidos[0]?.ocupacion || "",
      domicilio: listaIntervenidos[0]?.domicilio || "",
      asistido_confianza: listaIntervenidos[0]?.asistido_confianza || "",
      asistido_confianza_registro: listaIntervenidos[0]?.asistido_confianza_registro || "",

      efectivos_intervinientes_texto: obtenerTextoEfectivosNarrativa(listaEfectivosPNP),
      firmas_pnp: generarBloqueFirmasPNP(listaEfectivosPNP),

      filiacion_intervenidos: filiacionCompleta,
      resumen_intervenidos: textoIntervenidosColectivo,
      resumen_vehiculos: textoVehiculosColectivo,
      secciones_narrativa: bloquesNarrativaLista.join('\n\n'),
      calidad_detenido: listaIntervenidos.length > 1 ? "DETENIDOS" : "DETENIDO",
      bloque_firmas: bloqueFirmasG,
      hora_prueba: horaPruebaG,
      hora_termino: horaTerminoTotal,
      acta_situacion_vehicular_resultado: resultadoSituacionVehicular,

      intervenidos_resumen: textoIntervenidosColectivo,
      vehiculos_resumen: textoVehiculosColectivo,
      hora_intervencion: horaIntVal,
      fiscal: fiscalVal,
      agraviado: agraviadoVal,
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

    // REGISTRO EN SUPABASE (Aislado)
    try {
      const client = window.supabaseClient || (typeof supabaseClient !== 'undefined' ? supabaseClient : null);
      if (client && typeof client.from === 'function') {
        const { data, error } = await client.from('intervenciones').insert([{
          tipo_delito: datosFinalesBase.delito || "DILIGENCIA POLICIAL INDEPENDIENTE",
          fecha: datosFinalesBase.fecha,
          hora: datosFinalesBase.hora1,
          lugar: datosFinalesBase.lugar,
          intervenido_nombre: listaIntervenidos[0]?.nombre || "SIN NOMBRE",
          intervenido_dni: listaIntervenidos[0]?.dni || "S/D",
          efectivo_cargo: `${datosFinalesBase.grado} ${datosFinalesBase.personal_interviniente}`,
          datos_json: datosFinalesBase
        }]);

        if (error) {
          console.warn("⚠️ No se pudo registrar en Supabase:", error.message);
        } else {
          console.log("✅ Datos de intervención registrados en Supabase.");
        }
      }
    } catch (errSupabase) {
      console.warn("⚠️ Supabase offline o error de red:", errSupabase.message);
    }

    const JSZipLib = window.JSZip || (typeof JSZip !== 'undefined' ? JSZip : null);
    if (!JSZipLib) throw new Error("La librería JSZip no está cargada en el navegador.");

    const zip = new JSZipLib();
    let archivosAgregados = 0;
    let erroresArchivos = [];

    for (let acta of actasAProcesarSecuencia) {
      const hor = horariosPorActa[acta.id] || { horaInicio: "", horaTermino: "" };
      const esActaColectiva = (acta.esIndividual === false || acta.id === 'acta_intervencion' || acta.id === 'acta_hallazgo_recojo' || acta.id === 'acta_ocurrencia');
      const esActaVehicular = (acta.esVehicular === true || acta.id === 'acta_registro_vehicular' || acta.id === 'acta_inmovilizacion' || acta.id === 'acta_situacion_vehicular');

      if (esActaColectiva) {
        const datosDocIntervencion = {
          ...datosFinalesBase,
          intervenido_nombre: textoIntervenidosColectivo,
          intervenido_dni: listaIntervenidos.map(i => i.dni).join(' / '),
          licencia: listaIntervenidos.map(i => i.licencia || "________").join(' / '),
          categoria_licencia: listaIntervenidos.map(i => i.categoria_licencia || "____").join(' / '),
          edad: listaIntervenidos.map(i => i.edad).join(' / '),
          estado_civil: listaIntervenidos[0]?.estado_civil || "",
          natural: listaIntervenidos[0]?.natural || "",
          celular1: listaIntervenidos[0]?.celular || "S/N",
          papa: listaIntervenidos[0]?.papa || "S/D",
          mama: listaIntervenidos[0]?.mama || "S/D",
          ocupacion: listaIntervenidos[0]?.ocupacion || "",
          domicilio: listaIntervenidos[0]?.domicilio || "",
          asistido_confianza: listaIntervenidos[0]?.asistido_confianza || "",
          asistido_confianza_registro: listaIntervenidos[0]?.asistido_confianza_registro || "",
          hora1: hor.horaInicio || datosFinalesBase.hora1,
          hora2: hor.horaTermino || datosFinalesBase.hora2
        };

        try {
          const blobDoc = await generarDocumentoWord(acta.archivo, datosDocIntervencion);
          zip.file(`${acta.titulo}.docx`, blobDoc);
          archivosAgregados++;
        } catch (err) {
          console.error(`Error al generar ${acta.archivo}:`, err);
          erroresArchivos.push(`• ${acta.titulo}: ${err.message}`);
        }

      } else if (esActaVehicular) {
        for (let idxV = 0; idxV < listaVehiculos.length; idxV++) {
          const veh = listaVehiculos[idxV];
          const rutaPlantillaFinal = obtenerRutaArchivoActa(acta, veh);

          const datosDocVehiculo = {
            ...datosFinalesBase,
            placa_vehiculo: veh.placa,
            clase_vehiculo: veh.clase_vehiculo || "TRIMOVIL",
            marca_vehiculo: veh.marca,
            modelo_vehiculo: veh.modelo,
            color_vehiculo: veh.color,
            anio_fab_vehiculo: veh.anio_fab || "NO REGISTRA",
            num_motor_vehiculo: veh.num_motor || "NO REGISTRA",
            num_chasis_vehiculo: veh.num_chasis || "NO REGISTRA",
            hora1: hor.horaInicio || datosFinalesBase.hora1,
            hora2: hor.horaTermino || datosFinalesBase.hora2
          };

          try {
            const blobDoc = await generarDocumentoWord(rutaPlantillaFinal, datosDocVehiculo);
            const sufijoVehiculo = (listaVehiculos.length > 1) ? `_PLACA_${veh.placa}` : '';
            const nombreArchivoDoc = `${acta.titulo}${sufijoVehiculo}.docx`;

            zip.file(nombreArchivoDoc, blobDoc);
            archivosAgregados++;
          } catch (err) {
            console.error(`Error al generar ${rutaPlantillaFinal} para vehículo placa ${veh.placa}:`, err);
            erroresArchivos.push(`• ${acta.titulo} (${veh.placa}): ${err.message}`);
          }
        }

      } else {
        for (let idx = 0; idx < listaIntervenidos.length; idx++) {
          const persona = listaIntervenidos[idx];

          const datosDocIndividual = {
            ...datosFinalesBase,
            intervenido_nombre: persona.nombre,
            intervenido_dni: persona.dni,
            licencia: persona.licencia || "________",
            categoria_licencia: persona.categoria_licencia || "____",
            edad: persona.edad,
            estado_civil: persona.estado_civil,
            natural: persona.natural,
            celular1: persona.celular || "S/N",
            papa: persona.papa || "S/D",
            mama: persona.mama || "S/D",
            ocupacion: persona.ocupacion,
            domicilio: persona.domicilio,
            asistido_confianza: persona.asistido_confianza,
            asistido_confianza_registro: persona.asistido_confianza_registro,
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
            erroresArchivos.push(`• ${acta.titulo} (DNI ${persona.dni}): ${err.message}`);
          }
        }
      }
    }

    const guardarBlob = (blob, nombreArchivo) => {
      if (typeof saveAs === 'function') {
        saveAs(blob, nombreArchivo);
      } else {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = nombreArchivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };

    if (archivosAgregados === 1) {
      const soloFicheroKey = Object.keys(zip.files)[0];
      const blobUnico = await zip.file(soloFicheroKey).async("blob");
      guardarBlob(blobUnico, soloFicheroKey);
    } else if (archivosAgregados > 0) {
      const zipContent = await zip.generateAsync({ type: "blob" });
      guardarBlob(zipContent, `Expediente_PNP_${datosFinalesBase.distrito}_${datosFinalesBase.fecha}.zip`);
    } else {
      const detalleError = erroresArchivos.length > 0 ? `\n${erroresArchivos.join('\n')}` : '';
      throw new Error(`No se pudo compilar ninguna de las actas seleccionadas.${detalleError}`);
    }

    if (statusMsg) {
      statusMsg.className = "alert-msg alert-success";
      statusMsg.innerText = "✅ ¡Documentos generados exitosamente!";
    }

  } catch (err) {
    if (statusMsg) {
      statusMsg.className = "alert-msg alert-danger";
      statusMsg.innerText = "❌ Error al procesar expediente:\n" + err.message;
    }
    console.error("Error global en generación:", err);
    alert("❌ Error al generar las actas:\n" + err.message);
  }
}

async function generarDocumentoWord(rutaPlantilla, datos) {
  const PizZipLib = window.PizZip || window.pizzip || (window.PizZip && window.PizZip.default) || (typeof PizZip !== 'undefined' ? PizZip : null);
  const DocxLib = window.docxtemplater || window.Docxtemplater || (window.docxtemplater && window.docxtemplater.default) || (typeof docxtemplater !== 'undefined' ? docxtemplater : null);

  if (!PizZipLib) throw new Error("No se cargó la librería PizZip en el navegador. Revisa las etiquetas <script> en el HTML.");
  if (!DocxLib) throw new Error("No se cargó la librería Docxtemplater en el navegador. Revisa las etiquetas <script> en el HTML.");

  const urlAntiCache = `${rutaPlantilla}?t=${new Date().getTime()}`;
  const response = await fetch(urlAntiCache);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: No se encontró la plantilla en '${rutaPlantilla}'`);
  }

  const arrayBuffer = await response.arrayBuffer();
  
  let zip;
  try {
    zip = new PizZipLib(arrayBuffer);
  } catch (e) {
    throw new Error(`El archivo en '${rutaPlantilla}' no es un .docx válido: ${e.message}`);
  }

  let doc;
  try {
    doc = new DocxLib(zip, { 
      paragraphLoop: true, 
      linebreaks: true,
      nullGetter: function() { return ""; }
    });
    doc.render(datos);
  } catch (e) {
    throw new Error(`Etiqueta o formato en '${rutaPlantilla}' inválido: ${e.message}`);
  }

  return doc.getZip().generate({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

function limpiarPantalla() {
  if (confirm("¿Deseas limpiar la pantalla para registrar un nuevo expediente?")) {
    const form = document.getElementById('expedienteForm');
    if (form) form.reset();
    const fechaInput = document.getElementById('fecha');
    const hora1Input = document.getElementById('hora1');
    if (fechaInput) fechaInput.value = new Date().toISOString().split('T')[0];
    if (hora1Input) hora1Input.value = new Date().toTimeString().slice(0, 5);
  }
}
