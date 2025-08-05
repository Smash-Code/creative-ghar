
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA5-57IBYqDkXEuG4tQyvMrVK7bUfO3jRg",
  authDomain: "creative-ghar.firebaseapp.com",
  projectId: "creative-ghar",
  storageBucket: "creative-ghar.firebasestorage.app",
  messagingSenderId: "717579857649",
  appId: "1:717579857649:web:581dfb083ae4b331de0350"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);