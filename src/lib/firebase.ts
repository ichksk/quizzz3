// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD96HQnJ0oev2gkenbfqswqz2J15E-XC5M",
  authDomain: "quizzz-2c331.firebaseapp.com",
  projectId: "quizzz-2c331",
  storageBucket: "quizzz-2c331.firebasestorage.app",
  messagingSenderId: "190620294047",
  appId: "1:190620294047:web:b6f65e20b456047aa13baa",
  measurementId: "G-NYDWLKKNM3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);