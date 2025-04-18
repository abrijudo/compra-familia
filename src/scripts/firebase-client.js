import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyATDEW5DXHEU5ezVOY6Fl_MxqFvYHhq5Uo",
  authDomain: "compra-familia.firebaseapp.com",
  projectId: "compra-familia",
  storageBucket: "compra-familia.firebasestorage.app",
  messagingSenderId: "380227123539",
  appId: "1:380227123539:web:e2e698d420e116a6c849a6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, onAuthStateChanged };
