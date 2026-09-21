/**
 * MÓDULO UNIFICADO OCR IA (GOOGLE GEMINI)
 * Archivo: js/ocr.js (o js/ocr_dni.js)
 * Descripción: Maneja la configuración de la API Key de Gemini 3.6 Flash y el escaneo inteligente
 *              tanto para DNI de Intervenidos como para TIV (Tarjeta de Propiedad Vehicular).
 */

// =========================================================================
// 1. GESTIÓN GLOBAL DE API KEY GEMINI
// =========================================================================

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

function obtenerApiKeyGemini() {
    let apiKey = localStorage.getItem("google_gemini_key");
    if (!apiKey) {
        apiKey = prompt("🔑 Ingresa tu API Key de Google AI Studio:");
        if (apiKey && apiKey.trim() !== "") {
            apiKey = apiKey.trim();
            localStorage.setItem("google_gemini_key", apiKey);
        } else {
            alert("⚠️ Se requiere la API Key de Gemini para realizar el escaneo OCR.");
            return null;
        }
    }
    return apiKey;
}

// Globalizar función para acceder desde cualquier botón HTML
window.cambiarGeminiApiKey = cambiarGeminiApiKey;

// =========================================================================
// 2. ESCÁNER OCR DNI (PERSONAS / INTERVENIDOS)
// =========================================================================

function escanearDNICard(idCard) {
    const inputFoto = document.getElementById(`foto_dni_${idCard}`);
    if (inputFoto) {
        inputFoto.click();
    }
}

async function procesarDNICard(idCard) {
    const inputFoto = document.getElementById(`foto_dni_${idCard}`);
    const btnEscanear = document.getElementById(`btn_ocr_dni_${idCard}`) || document.getElementById(`btn_ocr_${idCard}`);

    if (!inputFoto || !inputFoto.files || !inputFoto.files[0]) {
        return;
    }

    const apiKey = obtenerApiKeyGemini();
    if (!apiKey) {
        inputFoto.value = "";
        return;
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

        const base64Data = await extraerBytesBase64(archivo);

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

        alert("✅ Datos del DNI cargados exitosamente.");

    } catch (error) {
        console.error("Error OCR DNI:", error);
        alert(`⚠️ No se pudo procesar la foto del DNI:\n${error.message}`);
    } finally {
        if (btnEscanear) {
            btnEscanear.disabled = false;
            btnEscanear.innerHTML = textoOriginalBtn;
            btnEscanear.style.background = "";
        }
        inputFoto.value = "";
    }
}

// =========================================================================
// 3. ESCÁNER OCR TIV (TARJETA DE PROPIEDAD VEHICULAR)
// =========================================================================

function escanearTIVCard(idCard) {
    const inputFoto = document.getElementById(`foto_tiv_${idCard}`);
    if (inputFoto) {
        inputFoto.click();
    }
}

async function procesarTIVCard(idCard) {
    const inputFoto = document.getElementById(`foto_tiv_${idCard}`);
    const btnEscanear = document.getElementById(`btn_ocr_tiv_${idCard}`);

    if (!inputFoto || !inputFoto.files || inputFoto.files.length === 0) {
        return;
    }

    const apiKey = obtenerApiKeyGemini();
    if (!apiKey) {
        inputFoto.value = "";
        return;
    }

    const textoOriginalBtn = btnEscanear ? btnEscanear.innerHTML : "";

    try {
        if (btnEscanear) {
            btnEscanear.disabled = true;
            btnEscanear.innerHTML = "⏳ Escaneando TIV...";
            btnEscanear.style.background = "#d97706";
        }

        const parts = [
            {
                text: `
                Analiza las imágenes adjuntas de la Tarjeta de Identificación Vehicular (TIV / Tarjeta de Propiedad Peruana) y extrae todos los datos del vehículo.
                Devuelve ÚNICAMENTE un objeto JSON válido con esta estructura exacta:
                {
                    "placa": "Número de placa en mayúsculas (ej. 4567-3Y o A1B-234)",
                    "clase": "Clase del vehículo en mayúsculas (ej. TRIMOVIL, AUTOMOVIL, CAMIONETA, MOTOCICLETA, etc.)",
                    "marca": "Marca del vehículo",
                    "modelo": "Modelo exacto del vehículo",
                    "color": "Color o colores principales del vehículo",
                    "anio_fab": "Año de fabricación en 4 dígitos",
                    "num_motor": "Número o código de motor",
                    "num_chasis": "Número de chasis, serie o VIN"
                }
                Si un campo no es visible o no es legible, coloca "".
                `
            }
        ];

        // Recorrer todas las fotos seleccionadas (admite 1 o 2 caras)
        for (let i = 0; i < inputFoto.files.length; i++) {
            const archivo = inputFoto.files[i];
            const base64Data = await extraerBytesBase64(archivo);
            const mimeType = archivo.type || "image/jpeg";
            parts.push({ inline_data: { mime_type: mimeType, data: base64Data } });
        }

        const urlAPI = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;

        const respuesta = await fetch(urlAPI, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: parts }],
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
            throw new Error("No se pudo procesar la tarjeta de propiedad.");
        }

        const res = JSON.parse(data.candidates[0].content.parts[0].text);

        // Asignación de datos a la tarjeta vehicular correspondiente
        if (res.placa && document.getElementById(`placa_vehiculo_${idCard}`)) {
            document.getElementById(`placa_vehiculo_${idCard}`).value = res.placa;
        }

        if (res.clase && document.getElementById(`clase_vehiculo_${idCard}`)) {
            document.getElementById(`clase_vehiculo_${idCard}`).value = res.clase;
        }

        if (res.marca && document.getElementById(`marca_vehiculo_${idCard}`)) {
            document.getElementById(`marca_vehiculo_${idCard}`).value = res.marca;
        }

        if (res.modelo && document.getElementById(`modelo_vehiculo_${idCard}`)) {
            document.getElementById(`modelo_vehiculo_${idCard}`).value = res.modelo;
        }

        if (res.color && document.getElementById(`color_vehiculo_${idCard}`)) {
            document.getElementById(`color_vehiculo_${idCard}`).value = res.color;
        }

        if (res.anio_fab && document.getElementById(`anio_fab_vehiculo_${idCard}`)) {
            document.getElementById(`anio_fab_vehiculo_${idCard}`).value = res.anio_fab;
        }

        if (res.num_motor && document.getElementById(`num_motor_vehiculo_${idCard}`)) {
            document.getElementById(`num_motor_vehiculo_${idCard}`).value = res.num_motor;
        }

        if (res.num_chasis && document.getElementById(`num_chasis_vehiculo_${idCard}`)) {
            document.getElementById(`num_chasis_vehiculo_${idCard}`).value = res.num_chasis;
        }

        alert("✅ Datos de la Tarjeta Vehicular (TIV) cargados exitosamente.");

    } catch (error) {
        console.error("Error OCR TIV:", error);
        alert(`⚠️ No se pudo procesar la foto de la TIV:\n${error.message}`);
    } finally {
        if (btnEscanear) {
            btnEscanear.disabled = false;
            btnEscanear.innerHTML = textoOriginalBtn;
            btnEscanear.style.background = "";
        }
        inputFoto.value = "";
    }
}

// =========================================================================
// 4. FUNCIONES AUXILIARES
// =========================================================================

function extraerBytesBase64(file) {
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
