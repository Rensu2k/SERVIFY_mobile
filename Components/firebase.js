import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2DX4i5Zjlv4h26uzOZrJbikQoFaPv1tA",
  authDomain: "servify-b5f82.firebaseapp.com",
  projectId: "servify-b5f82",
  storageBucket: "servify-b5f82.firebasestorage.app",
  messagingSenderId: "548475678485",
  appId: "1:548475678485:web:03c30988d3121ef9be831c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
