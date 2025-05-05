// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

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
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth with local persistence
const auth = getAuth(app);

// Set up persistence for authentication
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Error setting auth persistence:", error);
  });

// Enable offline persistence for Firestore
enableIndexedDbPersistence(db)
  .catch((error) => {
    console.error("Error enabling Firestore persistence:", error.code);
  });

// Export instances
export { db, auth, analytics };