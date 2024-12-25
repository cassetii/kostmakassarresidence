// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQUjxT0gVml-mlNV5m7jZuWaqjZsbZp7M",
  authDomain: "datanala.firebaseapp.com",
  projectId: "datanala",
  storageBucket: "datanala.firebasestorage.app",
  messagingSenderId: "1066017781256",
  appId: "1:1066017781256:web:30b69ab9d4a486548303bd",
  measurementId: "G-76L388CTL3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
