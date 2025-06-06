// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {

  apiKey: "AIzaSyDZlKSiRuVgwWremrcV6e9tITbnnEpUiBI",

  authDomain: "thermoflow-903b5.firebaseapp.com",

  projectId: "thermoflow-903b5",

  storageBucket: "thermoflow-903b5.firebasestorage.app",

  messagingSenderId: "107647215100",

  appId: "1:107647215100:web:1967cf714139e3dd60be79",

  measurementId: "G-VNSPW7RFYY"

};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

