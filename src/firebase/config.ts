// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQuaTqMRiTRjf9psygufa1rjfyVFxbJDE",
  authDomain: "corelinkdistribution-e5063.firebaseapp.com",
  projectId: "corelinkdistribution-e5063",
  storageBucket: "corelinkdistribution-e5063.firebasestorage.app",
  messagingSenderId: "148757713126",
  appId: "1:148757713126:web:174101c0f9fb0911e2ab27"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app); // 💡 Export the Storage instance