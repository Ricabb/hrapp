// frontend/src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Replace the following configuration with your Firebase config details from Step 1.
const firebaseConfig = {
  apiKey: "AIzaSyBSPUfnhkXF9d-bUedmZjtqP3QVvlBexVQ",
  authDomain: "richnet-hrv1.firebaseapp.com",
  projectId: "richnet-hrv1",
  storageBucket: "richnet-hrv1.firebasestorage.app",
  messagingSenderId: "274108969756",
  appId: "1:274108969756:web:653460c84454c8c0d240d9",
  measurementId: "G-9F6GP6GK9N"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
