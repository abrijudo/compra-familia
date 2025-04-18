import { auth } from '../firebaseConfig.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

window.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const msg = document.getElementById('msg');
  const err = document.getElementById('err');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      msg.style.display = 'none';
      err.style.display = 'none';
      const email = loginForm.email.value;
      const password = loginForm.password.value;
      try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = '/?message=' + encodeURIComponent('¡Bienvenido!');
      } catch (error) {
        let msg = '';
        switch (error.code) {
          case 'auth/user-not-found':
            msg = 'No existe una cuenta con ese correo.';
            break;
          case 'auth/wrong-password':
            msg = 'Contraseña incorrecta.';
            break;
          case 'auth/invalid-email':
            msg = 'El correo no es válido.';
            break;
          case 'auth/email-already-in-use':
            msg = 'El correo ya está registrado.';
            break;
          case 'auth/weak-password':
            msg = 'La contraseña debe tener al menos 6 caracteres.';
            break;
          case 'auth/missing-password':
            msg = 'Debes ingresar una contraseña.';
            break;
          case 'auth/too-many-requests':
            msg = 'Demasiados intentos fallidos. Intenta de nuevo más tarde.';
            break;
          case 'auth/network-request-failed':
            msg = 'Error de red. Verifica tu conexión.';
            break;
          default:
            msg = error.message || 'Error desconocido. Intenta de nuevo.';
        }
        err.textContent = msg;
        err.style.display = 'block';
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      msg.style.display = 'none';
      err.style.display = 'none';
      const email = registerForm.email.value;
      const password = registerForm.password.value;
      try {
        const nombre = registerForm.nombre.value.trim();
        const apellidos = registerForm.apellidos.value.trim();
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        // Guardar en Firestore
        const { getFirestore, doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js');
        const db = getFirestore();
        await setDoc(doc(db, 'users', cred.user.uid), {
          email,
          nombre,
          apellidos
        });
        msg.textContent = '¡Registro exitoso! Ahora puedes iniciar sesión.';
        msg.style.display = 'block';
        registerForm.reset();
      } catch (error) {
        let msg = '';
switch (error.code) {
  case 'auth/user-not-found':
    msg = 'No existe una cuenta con ese correo.';
    break;
  case 'auth/wrong-password':
    msg = 'Contraseña incorrecta.';
    break;
  case 'auth/invalid-email':
    msg = 'El correo no es válido.';
    break;
  case 'auth/email-already-in-use':
    msg = 'El correo ya está registrado.';
    break;
  case 'auth/weak-password':
    msg = 'La contraseña debe tener al menos 6 caracteres.';
    break;
  case 'auth/missing-password':
    msg = 'Debes ingresar una contraseña.';
    break;
  default:
    msg = error.message;
}
err.textContent = msg;
err.style.display = 'block';
      }
    });
  }
});
