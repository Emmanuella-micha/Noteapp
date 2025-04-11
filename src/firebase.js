// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAehLv5uIygSNVTP8LbvjRUkcpCVIF4uh4",
//   authDomain: "todo-app-e6470.firebaseapp.com",
//   projectId: "todo-app-e6470",
//   storageBucket: "todo-app-e6470.firebasestorage.app",
//   messagingSenderId: "790568185235",
//   appId: "1:790568185235:web:c3997301a93bebef2a0c66",
//   measurementId: "G-KBK5BEMVHW"
// };

// const app = initializeApp(firebaseConfig);

// const db = getFirestore(app);

// export{db};




// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // ✅ This is the missing import

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAehLv5uIygSNVTP8LbvjRUkcpCVIF4uh4",
  authDomain: "todo-app-e6470.firebaseapp.com",
  projectId: "todo-app-e6470",
  storageBucket: "todo-app-e6470.appspot.com", // you had .app instead of .com
  messagingSenderId: "790568185235",
  appId: "1:790568185235:web:c3997301a93bebef2a0c66",
  measurementId: "G-KBK5BEMVHW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // optional if you're using analytics
const db = getFirestore(app);

export { db };
