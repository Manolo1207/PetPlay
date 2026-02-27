import * as Facebook from 'expo-facebook';
import { FacebookAuthProvider } from 'firebase/auth';
// Login con Facebook: inicia sesión en Facebook y luego en Firebase
const loginWithFacebook = async (appId: string) => {
  try {
    await Facebook.initializeAsync({
      appId,
      appName: 'PetPlay',
    });
    const result = await Facebook.logInWithReadPermissionsAsync({
      permissions: ['public_profile', 'email'],
    });
    if (result.type === 'success' && result.token) {
      const credential = FacebookAuthProvider.credential(result.token);
      const userCredential = await signInWithCredential(auth, credential);
      return userCredential.user;
    } else {
      throw new Error('Inicio de sesión cancelado');
    }
  } catch (error: any) {
    throw new Error(error?.message || 'Error logging in with Facebook');
  }
};
import * as AppleAuthentication from 'expo-apple-authentication';
import { OAuthProvider } from 'firebase/auth';
// Login con Apple: inicia sesión en Apple y luego en Firebase
const loginWithApple = async () => {
  try {
    const appleCredential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    if (appleCredential.identityToken) {
      const provider = new OAuthProvider('apple.com');
      const firebaseCredential = provider.credential({
        idToken: appleCredential.identityToken,
      });
      const userCredential = await signInWithCredential(auth, firebaseCredential);
      return userCredential.user;
    } else {
      throw new Error('Apple login cancelled or failed');
    }
  } catch (error: any) {
    throw new Error(error?.message || 'Error logging in with Apple');
  }
};
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';

// Recibe el idToken de Google y hace login en Firebase
const loginWithGoogleIdToken = async (idToken: string) => {
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, credential);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error?.message || 'Error logging in with Google');
  }
};
// src/services/auth.ts

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from './firebase';
import { db, storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// Helper to upload a profile photo to Firebase Storage and return the download URL
const uploadProfilePhoto = async (uid: string, uri: string): Promise<string> => {
  // Convert local file URI to blob
  let blob: Blob;
  if (uri.startsWith('file://') || uri.startsWith('content://')) {
    // React Native/Expo: fetch the file and convert to blob
    const response = await fetch(uri);
    blob = await response.blob();
  } else {
    throw new Error('Invalid photo URI');
  }
  const storageRef = ref(storage, `profilePhotos/${uid}`);
  await uploadBytes(storageRef, blob);
  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
};
import { doc, setDoc, getDoc } from 'firebase/firestore';


// Función para registrar un nuevo usuario con email y contraseña
const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error?.message || 'Error registering user');
  }
};

const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error?.message || 'Error logging in');
  }
};

const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error?.message || 'Error logging out');
  }
};

const observeAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

const getUserData = async (uid: string) => {
  try {
    const docRef = doc(db, 'users', uid);
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data() as any) : null;
  } catch (error: any) {
    throw new Error(error?.message || 'Error fetching user data');
  }
};

export const authService = {
  savePushToken: async (uid: string, token: string) => {
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, { pushToken: token }, { merge: true });
  },
  register: async (email: string, password: string, name?: string, zone?: string) => {
    const user = await registerUser(email, password);
    if (user && name) {
      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        email,
        name,
        zone: zone || '',
        createdAt: Date.now(),
        photoUrl: '',
      });
    }
    return user;
  },
  login: loginUser,
  logout: logoutUser,
  observe: observeAuth,
  getUserData,
  loginWithGoogleIdToken,
  loginWithApple,
  loginWithFacebook,
  updateUserProfile: async (
    uid: string,
    data: { name?: string; zone?: string; photoUrl?: string; showDogInFeed?: boolean; communityNotifications?: boolean }
  ) => {
    const docRef = doc(db, 'users', uid);
    // Registrar cambios en el historial
    let editHistory = [];
    const snap = await getDoc(docRef);
    let updateData = { ...data };
    if (snap.exists()) {
      const userData = snap.data();
      editHistory = userData.profileEditHistory || [];
      if (data.name && data.name !== userData.name) {
        editHistory.push({ type: 'name', timestamp: Date.now() });
      }
      // If photoUrl is a local URI, upload to Storage and get download URL
      if (data.photoUrl && data.photoUrl !== userData.photoUrl) {
        if (data.photoUrl.startsWith('file://') || data.photoUrl.startsWith('content://')) {
          const downloadUrl = await uploadProfilePhoto(uid, data.photoUrl);
          updateData.photoUrl = downloadUrl;
        }
        editHistory.push({ type: 'photo', timestamp: Date.now() });
      }
    }
    (updateData as any).profileEditHistory = editHistory;
    await setDoc(docRef, updateData, { merge: true });
  },
  saveLocation: async (uid: string, location: { lat: number; lng: number }) => {
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, { location }, { merge: true });
  },
};