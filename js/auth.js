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

/// ==========================================
// 3. CONTROL DE SESIÓN Y CIERRE FORZADO EN LOGIN
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
  if (!window.supabaseClient) return;

  const currentPath = window.location.pathname.toLowerCase();
  const esPaginaLogin = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath.endsWith('/actas-pnp') || currentPath.endsWith('/actas-pnp/');

  // SI ESTÁS EN EL LOGIN (index.html): Forzamos el cierre de sesión explícitamente
  if (esPaginaLogin) {
    try {
      await window.supabaseClient.auth.signOut();
    } catch (e) {
      console.error("Error al limpiar sesión en Supabase:", e);
    }
    sessionStorage.clear();
    localStorage.clear();
    return; // Nos detenemos aquí para que se quede en el login pidiendo credenciales
  }

  // SI ESTÁS EN UNA PÁGINA PROTEGIDA (formulario.html): Validamos que exista sesión
  const { data: { session } } = await window.supabaseClient.auth.getSession();

  if (!session) {
    window.location.replace('index.html');
    return;
  }

  const chequeo = await verificarVigenciaUsuario(session.user.id);
  if (!chequeo.valido) {
    await cerrarSesion();
  }
});

// ==========================================
// 4. CONTROL DE SESIÓN SIN BUCLES Y GESTIÓN DE RETROCESO (BFCache)
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
  if (!window.supabaseClient) return;

  const currentPath = window.location.pathname.toLowerCase();
  const esPaginaLogin = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath.endsWith('/actas-pnp') || currentPath.endsWith('/actas-pnp/');

  const { data: { session } } = await window.supabaseClient.auth.getSession();

  if (session) {
    // Si ya tiene sesión y está intentando ver el login, lo mandamos al formulario
    if (esPaginaLogin) {
      const chequeo = await verificarVigenciaUsuario(session.user.id);
      if (chequeo.valido) {
        window.location.replace('formulario.html');
      } else {
        await cerrarSesion();
      }
    }
  } else {
    // Si NO tiene sesión y está intentando entrar a una página protegida (como formulario.html), lo mandamos al login
    if (!esPaginaLogin) {
      window.location.replace('index.html');
    }
  }
});

// Interceptar el evento 'pageshow' para detectar si el usuario usa el botón "Atrás" del navegador
window.addEventListener('pageshow', async (event) => {
  // event.persisted es true si la página se cargó desde la memoria caché (Back-Forward Cache)
  if (event.persisted || (performance && performance.navigation && performance.navigation.type === 2)) {
    const currentPath = window.location.pathname.toLowerCase();
    const esPaginaLogin = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath.endsWith('/actas-pnp') || currentPath.endsWith('/actas-pnp/');

    // Si el usuario está en el formulario y retrocedió, cerramos sesión por seguridad de inmediato
    if (!esPaginaLogin) {
      await cerrarSesion();
    }
  }
});

// ==========================================
// 5. MANEJO DEL FORMULARIO DE LOGIN
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

    // 2. Verificar fechas de inicio, fin y rol admin
    const chequeo = await verificarVigenciaUsuario(data.user.id);
    if (!chequeo.valido) {
      if (errorAlert) {
        errorAlert.innerText = chequeo.mensaje;
        errorAlert.style.display = 'block';
      }
      await window.supabaseClient.auth.signOut();
      return;
    }

    // 3. Redirección limpia sin bucles usando .replace()
    window.location.replace('formulario.html');
  });
}
