
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAgnCPURojAgCikVMz8kP0dn05zG4BEvIA",
  authDomain: "creative-dev-a9571.firebaseapp.com",
  projectId: "creative-dev-a9571",
  storageBucket: "creative-dev-a9571.firebasestorage.app",
  messagingSenderId: "880616191548",
  appId: "1:880616191548:web:5ad08ad301fe3f7c97b539"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);