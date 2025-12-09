// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWKRKsLfri2VIScAXfNlRdmq2jWpE4fhg",
  authDomain: "corelinkdistribution-app.firebaseapp.com",
  projectId: "corelinkdistribution-app",
  storageBucket: "corelinkdistribution-app.firebasestorage.app",
  messagingSenderId: "712906843486",
  appId: "1:712906843486:web:3e5c2db26aaeb44c649bcf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app); // 💡 Export the Storage instance