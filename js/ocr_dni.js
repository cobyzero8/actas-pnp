// Recupera la clave de Google AI Studio guardada en el navegador
document.addEventListener("DOMContentLoaded", () => {
    const claveGuardada = localStorage.getItem("google_gemini_key");
    if (claveGuardada && document.getElementById('apiKeyInput')) {
        document.getElementById('apiKeyInput').value = claveGuardada;
    }
});

function guardarApiKey() {
    const key = document.getElementById('apiKeyInput').value.trim();
    if (!key) {
        alert("Por favor, ingresa tu API Key de Google AI Studio.");
        return;
    }
    localStorage.setItem("google_gemini_key", key);
    alert("¡API Key de Google guardada con éxito!");
}

async function procesarDNIDirecto() {
    let apiKey = document.getElementById('apiKeyInput').value.trim();
    if (!apiKey) {
        apiKey = localStorage.getItem("google_gemini_key");
    }

    if (!apiKey) {
        alert("Ingresa tu API Key de Google AI Studio (obtenida en aistudio.google.com).");
        return;
    }

    const inputFoto = document.getElementById('fotoDNI');
    const btnProcesar = document.getElementById('btnProcesar');

    if (!inputFoto.files || !inputFoto.files[0]) {
        alert("Por favor, selecciona o toma una foto del DNI primero.");
        return;
    }

    const archivo = inputFoto.files[0];

    try {
        if (btnProcesar) btnProcesar.innerText = "⏳ Escaneando DNI con Gemini...";

        // Convertir foto a Base64
        const base64Data = await extraerBytesBase64(archivo);

        const promptInstrucciones = `
        Analiza la imagen de este DNI (peruano) y extrae los datos.
        Devuelve ÚNICAMENTE un objeto JSON válido con esta estructura exacta (sin texto ni formato markdown adicional):
        {
            "num_dni": "Número de 8 dígitos",
            "apellidos": "Apellidos completos",
            "nombres": "Nombres completos",
            "fecha_nacimiento": "YYYY-MM-DD",
            "estado_civil": "SOLTERO, CASADO, VIUDO o DIVORCIADO"
        }
        Si un campo no es legible, pon "".
        `;

        // Petición directa a la API de Google Gemini (Gratuita)
        const urlAPI = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const respuesta = await fetch(urlAPI, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: promptInstrucciones },
                        { inline_data: { mime_type: "image/jpeg", data: base64Data } }
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
            throw new Error("No se pudo interpretar la imagen. Revisa la nitidez de la foto.");
        }

        const textoJSON = data.candidates[0].content.parts[0].text;
        const jsonResultado = JSON.parse(textoJSON);

        // Llenar campos automáticamente en el HTML
        if (document.getElementById('num_dni')) {
            document.getElementById('num_dni').value = jsonResultado.num_dni || '';
        }

        const nombreCompleto = `${jsonResultado.nombres || ''} ${jsonResultado.apellidos || ''}`.trim();
        if (document.getElementById('nombres_apellidos')) {
            document.getElementById('nombres_apellidos').value = nombreCompleto;
        }

        if (document.getElementById('estado_civil')) {
            document.getElementById('estado_civil').value = jsonResultado.estado_civil || '';
        }

        if (jsonResultado.fecha_nacimiento && document.getElementById('edad')) {
            document.getElementById('edad').value = calcularEdad(jsonResultado.fecha_nacimiento);
        }

        alert("¡Datos del DNI cargados correctamente!");

    } catch (error) {
        console.error("Error al procesar el DNI:", error);
        alert(`Ocurrió un detalle:\n${error.message}`);
    } finally {
        if (btnProcesar) btnProcesar.innerText = "📷 Escanear DNI";
    }
}

// Convierte la imagen a formato Base64 para enviarla a Google
function extraerBytesBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });
}

// Calcula la edad en años a partir de YYYY-MM-DD
function calcularEdad(fechaNacStr) {
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
