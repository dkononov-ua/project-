import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database'; // Для Realtime Database
import { getStorage } from 'firebase/storage'; // Для Storage

const firebaseConfig = {
  apiKey: "AIzaSyD7jtcAm16O5vybYAcwdEoiANdb8y6-cfY",
  authDomain: "konnect-ukraine.firebaseapp.com",
  databaseURL: "https://konnect-ukraine-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "konnect-ukraine",
  storageBucket: "konnect-ukraine.appspot.com",
  messagingSenderId: "829086125717",
  appId: "1:829086125717:web:b307326f4cbd78f1d0d59c",
  measurementId: "G-BF1XW285E0"
};

// Ініціалізуємо Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const database = getDatabase(app); // Для Realtime Database
const storage = getStorage(app); // Для Storage

// Експортуємо екземпляри
export { app, auth, analytics, database, storage };
