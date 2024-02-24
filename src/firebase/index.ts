import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA4U03LObzHT2XkHybGQ6AqeQZzqYtaSio",
  authDomain: "tagihin-a702e.firebaseapp.com",
  projectId: "tagihin-a702e",
  storageBucket: "tagihin-a702e.appspot.com",
  messagingSenderId: "221723168600",
  appId: "1:221723168600:web:39c129595a25ccda805f2d",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db };

export default app;
