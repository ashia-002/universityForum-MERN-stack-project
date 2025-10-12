// src/services/auth.js
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth";
import app from "./firebase"; // 👈 import initialized Firebase app

// Initialize Firebase Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// --- Authentication functions ---
export const registerWithEmail = (email, password) => 
  createUserWithEmailAndPassword(auth, email, password);

export const loginWithEmail = (email, password) => 
  signInWithEmailAndPassword(auth, email, password);

export const loginWithGoogle = () => 
  signInWithPopup(auth, googleProvider);

export const logoutUser = () => signOut(auth);

export default auth;
