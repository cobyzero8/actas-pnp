// Configuración de Supabase
const SUPABASE_URL = 'https://hicjmlcdnrcjriuqhppb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInRlZiI6ImhpY2ptbGNkbnJjanJpdXFocHBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NDYxOTMsImV4cCI6MjA5ODUyMjE5M30.GIJbvJXKv-QkKx13xrImrUCf-kbRyOapW4QNA83qYb8';

window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: window.sessionStorage, // Se destruye al cerrar el navegador
    autoRefreshToken: true,
    persistSession: true
  }
});

// Función para verificar la vigencia de la cuenta del usuario
async function verificarVigenciaUsuario(userId) {
  const { data: perfil, error } = await window.supabaseClient
    .from('perfiles')
    .select('fecha_inicio, fecha_fin, activo')
    .eq('id', userId)
    .single();

  if (error || !perfil) {
    return { valido: false, mensaje: "No se encontró el perfil del usuario asignado." };
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

// Verificar sesión y vigencia al cargar cualquier página protegida
document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await window.supabaseClient.auth.getSession();
  const currentPath = window.location.pathname.toLowerCase();
  const esPaginaLogin = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath.endsWith('/actas-pnp');

  if (session) {
    // Validar fecha límite antes de darle acceso
    const chequeo = await verificarVigenciaUsuario(session.user.id);
    
    if (!chequeo.valido) {
      alert("⚠️ ACCESO DENEGADO:\n" + chequeo.mensaje);
      await window.supabaseClient.auth.signOut();
      sessionStorage.clear();
      window.location.href = 'index.html';
      return;
    }

    // Si todo está ok y está en el login, mandarlo al formulario
    if (esPaginaLogin) {
      window.location.href = 'formulario.html';
    }
  } else {
    // Si no tiene sesión y quiere entrar a una subpágina, expulsarlo
    if (!esPaginaLogin) {
      window.location.href = 'index.html';
    }
  }
});

// Evento de Login
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

    // 2. Verificar fechas de inicio y fin
    const chequeo = await verificarVigenciaUsuario(data.user.id);
    if (!chequeo.valido) {
      if (errorAlert) {
        errorAlert.innerText = chequeo.mensaje;
        errorAlert.style.display = 'block';
      }
      await window.supabaseClient.auth.signOut();
      return;
    }

    // Acceso permitido
    window.location.href = 'formulario.html';
  });
}
