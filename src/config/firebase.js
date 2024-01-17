import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyDHKYaH6Tv0dC8lZrLMA5pYdWm0t-48hq8",
    authDomain: "expense-tracker-app-b0f61.firebaseapp.com",
    projectId: "expense-tracker-app-b0f61",
    storageBucket: "expense-tracker-app-b0f61.appspot.com",
    messagingSenderId: "918428738202",
    appId: "1:918428738202:web:7af04374f867a87b823523",
    measurementId: "G-PFG34XTE1H"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);