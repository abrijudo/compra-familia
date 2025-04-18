// Funciones utilitarias centralizadas para Compra Familia
import { auth, db } from '../firebaseConfig.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';

/**
 * Obtiene los grupos del usuario autenticado usando el array groupIds de su documento.
 * @returns {Promise<Array<{id:string, name:string}>>} Array de grupos con id y nombre.
 */
export async function getUserGroups() {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async user => {
      if (!user) {
        resolve([]);
        return;
      }
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDocRef);
        if (!userSnap.exists() || !userSnap.data().groupIds || userSnap.data().groupIds.length === 0) {
          resolve([]);
          return;
        }
        const groupIds = userSnap.data().groupIds;
        const grupos = [];
        for (const groupId of groupIds) {
          const groupRef = doc(db, 'groups', groupId);
          const groupSnap = await getDoc(groupRef);
          if (groupSnap.exists()) {
            grupos.push({ id: groupId, name: groupSnap.data().name || groupId });
          }
        }
        resolve(grupos);
      } catch (e) {
        reject(e);
      }
    });
  });
}

/**
 * Devuelve el usuario autenticado actual (o null si no hay ninguno)
 */
export function getCurrentUser() {
  return auth.currentUser;
}


/**
 * Crea un nuevo grupo y actualiza el usuario y la subcolección de miembros.
 * @param {string} nombreGrupo
 * @returns {Promise<string>} id del grupo creado
 */
export async function crearGrupo(nombreGrupo) {
  if (!auth.currentUser) throw new Error('Debes iniciar sesión para crear un grupo.');
  const user = auth.currentUser;
  const { addDoc, collection, serverTimestamp, setDoc, doc, updateDoc, arrayUnion, getDoc } = await import('firebase/firestore');
  // 1. Crea el grupo
  const groupRef = await addDoc(collection(db, 'groups'), {
    name: nombreGrupo,
    createdBy: user.uid,
    createdAt: serverTimestamp()
  });
  // 2. Añade al creador como miembro (subcolección 'members')
  await setDoc(doc(db, 'groups', groupRef.id, 'members', user.uid), {
    uid: user.uid,
    role: 'admin',
    joinedAt: new Date()
  });
  // 3. Añade el groupId al usuario
  const userDocRef = doc(db, 'users', user.uid);
  const userDocSnap = await getDoc(userDocRef);
  if (userDocSnap.exists()) {
    await updateDoc(userDocRef, { groupIds: arrayUnion(groupRef.id) });
  } else {
    await setDoc(userDocRef, { groupIds: [groupRef.id] });
  }
  return groupRef.id;
}

/**
 * Actualiza el perfil del usuario autenticado.
 * @param {Object} datos {nombre, apellidos, fechaNacimiento, photoURL}
 * @returns {Promise<void>}
 */
export async function actualizarPerfil(datos) {
  if (!auth.currentUser) throw new Error('Debes iniciar sesión.');
  const user = auth.currentUser;
  const { updateProfile } = await import('firebase/auth');
  const { setDoc, doc } = await import('firebase/firestore');
  await updateProfile(user, {
    displayName: `${datos.nombre} ${datos.apellidos}`,
    photoURL: datos.photoURL || user.photoURL || ''
  });
  await setDoc(doc(db, 'users', user.uid), {
    nombre: datos.nombre,
    apellidos: datos.apellidos,
    fechaNacimiento: datos.fechaNacimiento,
    photoURL: datos.photoURL || user.photoURL || ''
  }, { merge: true });
}

// Puedes añadir más funciones utilitarias aquí según crezca el proyecto
