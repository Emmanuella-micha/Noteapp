// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // ✅ Added for authentication

const firebaseConfig = {
  apiKey: "AIzaSyAjjqqoO78vzq1_uOcVKI33VQF_ik4G5zs",
  authDomain: "mynotes-1ded0.firebaseapp.com",
  projectId: "mynotes-1ded0",
  storageBucket: "mynotes-1ded0.firebasestorage.app",
  messagingSenderId: "693763454040",
  appId: "1:693763454040:web:6d2f85f5d93abe4f10462d",
  measurementId: "G-83BW1VQE3T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Optional
const db = getFirestore(app);
const auth = getAuth(app); // ✅ Auth instance

// Export instances
export { db, auth };
