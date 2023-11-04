// Import the functions you need from the SDKs you need
import { initializeApp as initializeBaseApp } from "@firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth as getBaseAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5TCfMfx7ae8QySnASwVQAMzWGOnYKziE",
  authDomain: "ui-ux-f447b.firebaseapp.com",
  projectId: "ui-ux-f447b",
  storageBucket: "ui-ux-f447b.appspot.com",
  messagingSenderId: "984149898283",
  appId: "1:984149898283:web:0acf93db830e4b988f666e"
};

// Initialize Firebase
const app = initializeBaseApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getBaseAuth(app);
export const storage = getStorage();