/**
 * MÓDULO EXCLUSIVO: OCR DNI DE INTERVENIDOS (GOOGLE GEMINI IA)
 * Archivo: js/ocr_dni.js
 * Descripción: Maneja la configuración de la API Key y el escaneo de DNI con Gemini 3.6 Flash.
 */

// 1. Configuración de API Key desde el botón "🔑 Configurar API Key IA"
function cambiarGeminiApiKey() {
    const actualKey = localStorage.getItem("google_gemini_key") || "";
    const keyMascara = actualKey ? `${actualKey.substring(0, 6)}...${actualKey.slice(-4)}` : "No configurada";
    
    const nuevaKey = prompt(
        `🔑 Configurar API Key de Google AI Studio (Gemini):\n\nEstado actual: ${keyMascara}\n\nIngresa la nueva API Key (deja en blanco para eliminar):`, 
        actualKey
    );

    if (nuevaKey !== null) {
        const keyLimpia = nuevaKey.trim();
        if (keyLimpia !== "") {
            localStorage.setItem("google_gemini_key", keyLimpia);
            alert("✅ ¡API Key guardada correctamente!");
        } else {
            localStorage.removeItem("google_gemini_key");
            alert("ℹ️ API Key eliminada.");
        }
    }
}

// Hacer global la función para asegurar su ejecución desde onclick en formulario.html
window.cambiarGeminiApiKey = cambiarGeminiApiKey;

// 2. Abre el selector de cámara/archivo de la tarjeta del intervenido
function escanearDNICard(idCard) {
    const inputFoto = document.getElementById(`foto_dni_${idCard}`);
    if (inputFoto) {
        inputFoto.click();
    }
}

// 3. Procesa la foto del DNI y llena los campos de la tarjeta del intervenido
async function procesarDNICard(idCard) {
    const inputFoto = document.getElementById(`foto_dni_${idCard}`);
    const btnEscanear = document.getElementById(`btn_ocr_${idCard}`);

    if (!inputFoto || !inputFoto.files || !inputFoto.files[0]) {
        return;
    }

    let apiKey = localStorage.getItem("google_gemini_key");

    if (!apiKey) {
        apiKey = prompt("🔑 Ingresa tu API Key de Google AI Studio:");
        if (apiKey && apiKey.trim() !== "") {
            localStorage.setItem("google_gemini_key", apiKey.trim());
        } else {
            alert("⚠️ Se requiere la API Key de Gemini para escanear el DNI.");
            inputFoto.value = "";
            return;
        }
    }

    const archivo = inputFoto.files[0];
    const mimeType = archivo.type || "image/jpeg";
    const textoOriginalBtn = btnEscanear ? btnEscanear.innerHTML : "";

    try {
        if (btnEscanear) {
            btnEscanear.disabled = true;
            btnEscanear.innerHTML = "⏳ Leyendo DNI...";
            btnEscanear.style.background = "#d97706";
        }

        const base64Data = await extraerBytesBase64DNI(archivo);

        const promptInstrucciones = `
        Analiza la imagen de este DNI peruano y extrae los datos del ciudadano.
        Devuelve ÚNICAMENTE un objeto JSON válido con esta estructura exacta:
        {
            "num_dni": "Número de 8 dígitos",
            "apellidos": "Apellidos completos en MAYÚSCULAS",
            "nombres": "Nombres completos",
            "fecha_nacimiento": "YYYY-MM-DD",
            "estado_civil": "SOLTERO, CASADO, VIUDO o CONVIVIENTE",
            "domicilio": "Dirección exacta",
            "lugar_nacimiento": "Lugar de nacimiento"
        }
        Si un campo no es legible, devuelve "".
        `;

        // URL configurada con el modelo gemini-3.6-flash
        const urlAPI = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;

        const respuesta = await fetch(urlAPI, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: promptInstrucciones },
                        { inline_data: { mime_type: mimeType, data: base64Data } }
                    ]
                }],
                generationConfig: {
                    response_mime_type: "application/json"
                }
            })
        });

        const data = await respuesta.json();

        if (data.error) {
            throw new Error(`Google API: ${data.error.message || JSON.stringify(data.error)}`);
        }

        if (!data.candidates || !data.candidates[0]) {
            throw new Error("No se pudo interpretar la imagen del DNI.");
        }

        const res = JSON.parse(data.candidates[0].content.parts[0].text);

        if (res.num_dni && document.getElementById(`intervenido_dni_${idCard}`)) {
            document.getElementById(`intervenido_dni_${idCard}`).value = res.num_dni;
        }

        if ((res.apellidos || res.nombres) && document.getElementById(`intervenido_nombre_${idCard}`)) {
            const aps = (res.apellidos || '').toUpperCase().trim();
            const noms = (res.nombres || '').trim();
            document.getElementById(`intervenido_nombre_${idCard}`).value = aps ? `${aps}, ${noms}` : noms;
        }

        if (res.fecha_nacimiento && document.getElementById(`edad_${idCard}`)) {
            const edad = calcularEdadDNI(res.fecha_nacimiento);
            if (edad) document.getElementById(`edad_${idCard}`).value = edad;
        }

        if (res.estado_civil && document.getElementById(`estado_civil_${idCard}`)) {
            const est = res.estado_civil.toUpperCase();
            const select = document.getElementById(`estado_civil_${idCard}`);
            if (est.includes("CASAD")) select.value = "casado";
            else if (est.includes("VIUD")) select.value = "viudo";
            else if (est.includes("CONVIV")) select.value = "conviviente";
            else select.value = "soltero";
        }

        if (res.domicilio && document.getElementById(`domicilio_${idCard}`)) {
            document.getElementById(`domicilio_${idCard}`).value = res.domicilio;
        }

        if (res.lugar_nacimiento && document.getElementById(`natural_${idCard}`)) {
            document.getElementById(`natural_${idCard}`).value = res.lugar_nacimiento;
        }

        alert("✅ Datos del DNI cargados en el intervenido.");

    } catch (error) {
        console.error("Error OCR DNI:", error);
        alert(`⚠️ No se pudo procesar la foto:\n${error.message}`);
    } finally {
        if (btnEscanear) {
            btnEscanear.disabled = false;
            btnEscanear.innerHTML = textoOriginalBtn;
            btnEscanear.style.background = "";
        }
        inputFoto.value = "";
    }
}

function extraerBytesBase64DNI(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = err => reject(err);
    });
}

function calcularEdadDNI(fechaNacStr) {
    const nacimiento = new Date(fechaNacStr);
    const hoy = new Date();
    if (isNaN(nacimiento.getTime())) return "";

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const difMeses = hoy.getMonth() - nacimiento.getMonth();
    if (difMeses < 0 || (difMeses === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad.toString();
}
