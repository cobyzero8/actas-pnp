// Configuración de Supabase
const SUPABASE_URL = 'https://hicjmlcdnrcjriuqhppb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpY2ptbGNkbnJjanJpdXFocHBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NDYxOTMsImV4cCI6MjA5ODUyMjE5M30.GIJbvJXKv-QkKx13xrImrUCf-kbRyOapW4QNA83qYb8';

// Inicializar Supabase usando sessionStorage (la sesión se destruye al cerrar el navegador)
window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: window.sessionStorage, // 🔑 Se borra al cerrar pestaña/navegador
    autoRefreshToken: true,
    persistSession: true
  }
});

// Verificar sesión al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await window.supabaseClient.auth.getSession();
  const currentPath = window.location.pathname.toLowerCase();

  const esPaginaLogin = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath.endsWith('/actas-pnp');

  // Si ya inició sesión y está en la página de login, redirigir al formulario/menú
  if (session && esPaginaLogin) {
    window.location.href = 'formulario.html';
  }

  // Si NO ha iniciado sesión y NO está en la página de login, expulsar a index.html
  if (!session && !esPaginaLogin) {
    window.location.href = 'index.html';
  }
});

// Manejo del formulario de Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorAlert = document.getElementById('errorAlert');

    if (errorAlert) errorAlert.style.display = 'none';

    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      if (errorAlert) {
        errorAlert.innerText = "Credenciales incorrectas: " + error.message;
        errorAlert.style.display = 'block';
      }
    } else {
      window.location.href = 'formulario.html';
    }
  });
}

// Función global para Cerrar Sesión manualmente
async function cerrarSesion() {
  if (window.supabaseClient) {
    await window.supabaseClient.auth.signOut();
  }
  sessionStorage.clear();
  localStorage.clear();
  window.location.href = 'index.html';
}
