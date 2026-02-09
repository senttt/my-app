// firebase.js (firebase configuration and initialization)
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCTHS9vs5zHkosMzO_XU9FHuP2h0Zpt6Y",
  authDomain: "financeproject-5135d.firebaseapp.com",
  projectId: "financeproject-5135d",
  storageBucket: "financeproject-5135d.firebasestorage.app",
  messagingSenderId: "1039820996069",
  appId: "1:1039820996069:web:05ade719803508f2a9430c",
  measurementId: "G-F4599LK4XG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  app,
  auth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  db,
  createUserWithEmailAndPassword,
};
