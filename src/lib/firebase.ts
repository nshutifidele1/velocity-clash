import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration from environment variables or defaults
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDRAyHbKG9taGuvtH0Ko_vQys6_PsEyaQs",
  authDomain: "blur-racing-competition.firebaseapp.com",
  projectId: "blur-racing-competition",
  storageBucket: "blur-racing-competition.firebasestorage.app",
  messagingSenderId: "1082293765041",
  appId: "1:1082293765041:web:b3bfc55689504c7dc2f390",
  measurementId: "G-HY5N0H2PQ4"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
