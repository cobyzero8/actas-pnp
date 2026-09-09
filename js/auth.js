// Configuración de Supabase
const SUPABASE_URL = 'https://hicjmlcdnrcjriuqhppb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpY2ptbGNkbnJjanJpdXFocHBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NDYxOTMsImV4cCI6MjA5ODUyMjE5M30.GIJbvJXKv-QkKx13xrImrUCf-kbRyOapW4QNA83qYb8';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Verificar sesión al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await supabaseClient.auth.getSession();
  const currentPath = window.location.pathname;

  // Si ya inició sesión y está en el login, redirigir al menú
  if (session && (currentPath.endsWith('index.html') || currentPath.endsWith('/'))) {
    window.location.href = 'menu.html';
  }

  // Si NO ha iniciado sesión y está en menú o formulario, mandar al login
  if (!session && !currentPath.endsWith('index.html') && !currentPath.endsWith('/')) {
    window.location.href = 'index.html';
  }
});

// Manejo del formulario de Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorAlert = document.getElementById('errorAlert');

    errorAlert.style.display = 'none';

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      errorAlert.innerText = "Credenciales incorrectas: " + error.message;
      errorAlert.style.display = 'block';
    } else {
      window.location.href = 'menu.html';
    }
  });
}

// Función global para Cerrar Sesión
async function cerrarSesion() {
  await supabaseClient.auth.signOut();
  localStorage.clear();
  window.location.href = 'index.html';
}
