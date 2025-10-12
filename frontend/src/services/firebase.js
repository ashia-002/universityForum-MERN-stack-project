// src/services/firebase.js

// Import the Firebase core and auth SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC190BmTV2yoNShrevhz4LB0GD3NuxjGb0",
  authDomain: "university-forum-6a1bb.firebaseapp.com",
  projectId: "university-forum-6a1bb",
  storageBucket: "university-forum-6a1bb.firebasestorage.app",
  messagingSenderId: "775736966513",
  appId: "1:775736966513:web:cb7263c136c0e7398a0ad0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

export default app;
