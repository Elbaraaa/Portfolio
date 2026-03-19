// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJ5XAi0AVHX3j-tOZSW8fGX4ZJPit3jR8",
  authDomain: "portfolio-60cf6.firebaseapp.com",
  projectId: "portfolio-60cf6",
  storageBucket: "portfolio-60cf6.firebasestorage.app",
  messagingSenderId: "461510424321",
  appId: "1:461510424321:web:7a4546ad3e89bf0654cd00",
  measurementId: "G-7V1MVT6SY8"
};

// Initialize Firebase
import { getFirestore } from "firebase/firestore";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);