import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyDyRLhlrUww-X0IabJTXaot0rzOj-JTF6U",
  authDomain: "mysmartbottle-e2f9a.firebaseapp.com",
  databaseURL: "https://mysmartbottle-e2f9a-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mysmartbottle-e2f9a",
  storageBucket: "mysmartbottle-e2f9a.appspot.com",
  messagingSenderId: "909100696674",
  appId: "1:909100696674:web:a1bbd6fca1e1850b50fd3b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestoreDB = getFirestore(app);

export default app;
