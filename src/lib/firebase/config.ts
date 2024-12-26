import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCtVahjLSpAVRoDYILx6YXmpJ6t8MP4ZcI",
  authDomain: "eurochem-app.firebaseapp.com",
  projectId: "eurochem-app",
  storageBucket: "eurochem-app.firebasestorage.app",
  messagingSenderId: "505024914550",
  appId: "1:505024914550:web:6efd8a60e9ea8cc841ab57",
  measurementId: "G-Y3C4M2NWC9"
};

export const app = initializeApp(firebaseConfig);