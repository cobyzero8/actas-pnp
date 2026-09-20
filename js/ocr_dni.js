document.addEventListener("DOMContentLoaded", () => {
    const claveGuardada = localStorage.getItem("openrouter_key");
    if (claveGuardada && document.getElementById('apiKeyInput')) {
        document.getElementById('apiKeyInput').value = claveGuardada;
    }
});

function guardarApiKey() {
    const key = document.getElementById('apiKeyInput').value.trim();
    if (!key) {
        alert("Por favor, ingresa tu API Key.");
        return;
    }
    localStorage.setItem("openrouter_key", key);
    alert("¡API Key guardada con éxito!");
}

async function procesarDNIOpenRouter() {
    let apiKey = document.getElementById('apiKeyInput').value.trim();
    if (!apiKey) {
        apiKey = localStorage.getItem("openrouter_key");
    }

    if (!apiKey) {
        alert("Por favor, ingresa tu API Key de OpenRouter primero.");
        return;
    }

    const inputFoto = document.getElementById('fotoDNI');
    const btnProcesar = document.getElementById('btnProcesar');
    const modeloSeleccionado = document.getElementById('modelSelect').value; // Obtiene el modelo elegido

    if (!inputFoto.files || !inputFoto.files[0]) {
        alert("Por favor, selecciona o toma una foto del DNI primero.");
        return;
    }

    const archivo = inputFoto.files[0];

    try {
        if (btnProcesar) btnProcesar.innerText = "⏳ Procesando con IA...";

        const base64Image = await convertirBase64(archivo);

        const promptInstrucciones = `
        Analiza la imagen de este DNI peruano y extrae los datos.
        Devuelve ÚNICAMENTE un objeto JSON estricto con esta estructura exacta (sin texto adicional ni marcas markdown):
        {
            "num_dni": "Número de 8 dígitos",
            "apellidos": "Apellidos completos",
            "nombres": "Nombres completos",
            "fecha_nacimiento": "YYYY-MM-DD",
            "estado_civil": "SOLTERO, CASADO, VIUDO o DIVORCIADO"
        }
        Si un campo no es legible, pon "".
        `;

        const respuesta = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": window.location.href,
                "X-Title": "Actas PNP OCR"
            },
            body: JSON.stringify({
                model: modeloSeleccionado, // Usa dinámicamente el modelo elegido
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: promptInstrucciones },
                            { type: "image_url", image_url: { url: base64Image } }
                        ]
                    }
                ],
                temperature: 0.1
            })
        });

        const data = await respuesta.json();

        if (data.error) {
            throw new Error(`Error (${data.error.code || 'API'}): ${data.error.message || JSON.stringify(data.error)}`);
        }

        if (!data.choices || !data.choices[0]) {
            throw new Error("Respuesta no válida del modelo.");
        }

        let contenido = data.choices[0].message.content;
        contenido = contenido.replace(/```json/gi, "").replace(/```/g, "").trim();
        const jsonResultado = JSON.parse(contenido);

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

        alert("¡Datos del DNI leídos con éxito!");

    } catch (error) {
        console.error("Error al procesar el DNI:", error);
        alert(`Ocurrió un detalle:\n${error.message}`);
    } finally {
        if (btnProcesar) btnProcesar.innerText = "📷 Escanear DNI";
    }
}

function convertirBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

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
