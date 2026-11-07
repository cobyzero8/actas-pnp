// ==========================================
// 1. INICIALIZACIÓN ÚNICA DE SUPABASE
// ==========================================
const SUPABASE_URL = (typeof CONFIG !== 'undefined' && CONFIG.SUPABASE_URL) ? CONFIG.SUPABASE_URL : 'https://hicjmlcdnrcjriuqhppb.supabase.co';
const SUPABASE_ANON_KEY = (typeof CONFIG !== 'undefined' && CONFIG.SUPABASE_ANON_KEY) ? CONFIG.SUPABASE_ANON_KEY : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpY2ptbGNkbnJjanJpdXFocHBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NDYxOTMsImV4cCI6MjA5ODUyMjE5M30.GIJbvJXKv-QkKx13xrImrUCf-kbRyOapW4QNA83qYb8';

if (!window.supabaseClient && typeof supabase !== 'undefined') {
  window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: window.sessionStorage,
      autoRefreshToken: true,
      persistSession: true
    }
  });
}

// ==========================================
// 2. VERIFICACIÓN DE VIGENCIA Y ROL
// ==========================================
async function verificarVigenciaUsuario(userId) {
  const { data: perfil, error } = await window.supabaseClient
    .from('perfiles')
    .select('rol, fecha_inicio, fecha_fin, activo')
    .eq('id', userId)
    .single();

  if (error || !perfil) {
    return { valido: false, mensaje: "No se encontró el perfil del usuario asignado en la base de datos." };
  }

  // Administrador con acceso total
  if (perfil.rol === 'admin') {
    return { valido: true };
  }

  if (!perfil.activo) {
    return { valido: false, mensaje: "Su cuenta ha sido desactivada." };
  }

  const ahora = new Date();
  const fechaInicio = new Date(perfil.fecha_inicio);
  const fechaFin = new Date(perfil.fecha_fin);

  if (ahora < fechaInicio) {
    return { valido: false, mensaje: `Su acceso aún no está habilitado (Inicia: ${fechaInicio.toLocaleDateString()}).` };
  }

  if (ahora > fechaFin) {
    return { valido: false, mensaje: `Su periodo de acceso ha caducado el ${fechaFin.toLocaleDateString()}.` };
  }

  return { valido: true };
}

// ==========================================
// 3. FUNCIÓN GLOBAL DE CIERRE DE SESIÓN LIMPIO
// ==========================================
async function cerrarSesion() {
  try {
    if (window.supabaseClient) {
      await window.supabaseClient.auth.signOut();
    }
  } catch (e) {
    console.error("Error al cerrar sesión en Supabase:", e);
  }
  
  sessionStorage.clear();
  localStorage.clear();
  window.location.replace('index.html');
}

// ==========================================
// 4. CONTROL DE SESIÓN ESTRICTO (ÚNICO Y UNIFICADO)
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
  if (!window.supabaseClient) return;

  const currentPath = window.location.pathname.toLowerCase();
  const esPaginaLogin = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath.endsWith('/actas-pnp') || currentPath.endsWith('/actas-pnp/');

  // SI ESTÁS EN EL LOGIN (index.html): Forzamos limpieza explícita de sesión anterior
  if (esPaginaLogin) {
    try {
      await window.supabaseClient.auth.signOut();
    } catch (e) {}
    sessionStorage.clear();
    localStorage.clear();
    return; // Nos detenemos aquí para esperar credenciales
  }

  // SI ESTÁS EN UNA PÁGINA PROTEGIDA (formulario.html u otra):
  const { data: { session }, error } = await window.supabaseClient.auth.getSession();

  // Si no hay sesión o hay error de token, expulsar inmediatamente al login
  if (!session || error) {
    window.location.replace('index.html');
    return;
  }

  // Validar vigencia de fechas y estado activo del usuario
  const chequeo = await verificarVigenciaUsuario(session.user.id);
  if (!chequeo.valido) {
    await cerrarSesion();
  }
});

// ==========================================
// 5. GESTIÓN DE RETROCESO (BFCache del Navegador)
// ==========================================
window.addEventListener('pageshow', async (event) => {
  // Si el usuario presiona "Atrás" y la página se recupera de la caché del navegador
  if (event.persisted || (performance && performance.navigation && performance.navigation.type === 2)) {
    const currentPath = window.location.pathname.toLowerCase();
    const esPaginaLogin = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath.endsWith('/actas-pnp') || currentPath.endsWith('/actas-pnp/');

    // Si retrocedió y está en una página protegida, cerramos sesión por seguridad
    if (!esPaginaLogin) {
      await cerrarSesion();
    }
  }
});

// ==========================================
// 6. MANEJO DEL FORMULARIO DE LOGIN
// ==========================================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorAlert = document.getElementById('errorAlert');

    if (errorAlert) errorAlert.style.display = 'none';

    // 1. Autenticar con Supabase Auth
    const { data, error } = await window.supabaseClient.auth.signInWithPassword({ email, password });

    if (error) {
      if (errorAlert) {
        errorAlert.innerText = "Credenciales incorrectas: " + error.message;
        errorAlert.style.display = 'block';
      }
      return;
    }

    // 2. Verificar fechas de inicio, fin y estado activo
    const chequeo = await verificarVigenciaUsuario(data.user.id);
    if (!chequeo.valido) {
      if (errorAlert) {
        errorAlert.innerText = chequeo.mensaje;
        errorAlert.style.display = 'block';
      }
      await window.supabaseClient.auth.signOut();
      return;
    }

    // 3. Redirección limpia al formulario
    window.location.replace('formulario.html');
  });
}
