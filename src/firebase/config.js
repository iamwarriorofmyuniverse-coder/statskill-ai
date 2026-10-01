import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Safe environment resolution (supports both Vite browser runtime and Node tests)
const env = (typeof import.meta !== "undefined" && import.meta.env) ? import.meta.env : (typeof process !== "undefined" && process.env ? process.env : {});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID
};

const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "" &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== ""
);

let app = null;
let auth = null;
let db = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: "select_account" });
    console.log("StatSkill AI: Connected to live Firebase project:", firebaseConfig.projectId);
  } catch (error) {
    console.warn("StatSkill AI: Firebase initialization failed, running in resilient prototype mode:", error.message);
  }
} else {
  console.info("StatSkill AI: Running with local Demo & Prototype State Engine.");
}

export { app, auth, db, googleProvider, isFirebaseConfigured, signInWithPopup, signOut };
