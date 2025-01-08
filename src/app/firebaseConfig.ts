// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAte4qeqQkAT3n5GcKkieSUp5SQW-bsoME",
    authDomain: "calmbridge.firebaseapp.com",
    projectId: "calmbridge",
    storageBucket: "calmbridge.firebasestorage.app",
    messagingSenderId: "420124234339",
    appId: "1:420124234339:web:2438814ad1c8053dd0de56",
    measurementId: "G-0ZTF1Y0X7R"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export { auth, db, analytics };
