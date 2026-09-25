import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyA1QNPD5WC-ulT43U4efCyx_f3oO64va-s",
    authDomain: "attendcheck-d36fe.firebaseapp.com",
    projectId: "attendcheck-d36fe",
    storageBucket: "attendcheck-d36fe.firebasestorage.app",
    messagingSenderId: "17782415800",
    appId: "1:17782415800:web:546fc6dbfda3f775f3ef4d"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };