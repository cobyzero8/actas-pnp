// js/config.js
const CONFIG = {
  SUPABASE_URL: "https://hicjmlcdnrcjriuqhppb.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // La Anon Key de Supabase sí se puede subir
  GEMINI_API_KEY: "" // Déjala vacía para que no la bloquee GitHub
};

// Inicializador global
if (typeof supabase !== 'undefined' && CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY) {
  window.supabaseClient = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
}
