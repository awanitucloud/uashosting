// static/js/js/firebaseInit.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { 
    getDatabase, ref, set, onValue, 
    push, query, orderByChild, limitToLast 
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

// GANTI DENGAN KONFIGURASI FIREBASE KAMU
const firebaseConfig = {
    apiKey: "AIzaSyDH1oAAi4eMOSqdw5-3ieXlZdb70UATt3U",
    authDomain: "gameularweb.firebaseapp.com",
    databaseURL: "https://gameularweb-default-rtdb.firebaseio.com", 
    projectId: "gameularweb",
    storageBucket: "gameularweb.firebasestorage.app",
    messagingSenderId: "963814002365",
    appId: "1:963814002365:web:ebb83705b6c4235589b1d4"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { 
    db, ref, set, onValue, push, 
    query, orderByChild, limitToLast 
};