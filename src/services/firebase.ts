// src/services/firebase.ts

// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";

// Import the authentication and firestore services we will use
import { getAuth } from "firebase/auth"; // Added
import { getFirestore } from "firebase/firestore"; // Added
import { getStorage } from "firebase/storage"; // Added

// Google Analytics solo funciona en web - no usar en React Native
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAeltOYh-NZ4h_BvSTBmq1_wCkf4YaHoc4",
  authDomain: "petplay-83088.firebaseapp.com",
  projectId: "petplay-83088",
  storageBucket: "petplay-83088.firebasestorage.app",
  messagingSenderId: "334517162215",
  appId: "1:334517162215:web:a12e9ae1e1c194d1661242",
  measurementId: "G-Z98KCH4WDZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics solo en web (opcional)
// if (typeof window !== 'undefined') {
//   getAnalytics(app);
// }

// Export the Auth and Firestore instances to use them in other files

export const auth = getAuth(app); // Added
export const db = getFirestore(app); // Added
export const storage = getStorage(app); // Added

// Export the main app instance (optional, but useful)
export default app;
