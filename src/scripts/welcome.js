import { auth, onAuthStateChanged } from '../firebaseConfig.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginLink = document.getElementById('login-link');
  const welcomeMsg = document.getElementById('welcome-msg');
  onAuthStateChanged(auth, user => {
    console.log('[Compra Familia] Estado de usuario:', user);
    if (user) {
      loginLink && (loginLink.style.display = 'none');
      welcomeMsg && (welcomeMsg.textContent = `¡Bienvenido, ${user.email}!`);
    } else {
      loginLink && (loginLink.style.display = 'block');
      welcomeMsg && (welcomeMsg.textContent = 'Gracias por usar nuestra aplicación. Esperamos que disfrutes tu experiencia de compra en familia.');
    }
  });
});
