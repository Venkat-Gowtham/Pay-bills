

// Firebase client-side SDK imports
const { initializeApp: initializeClientApp } = require("firebase/app");
const { getAuth, GoogleAuthProvider } = require("firebase/auth");
const { getFirestore: getClientFirestore } = require("firebase/firestore");

// Firebase Admin SDK imports
const { initializeApp: initializeAdminApp, cert } = require("firebase-admin/app");
const { getFirestore: getAdminFirestore } = require("firebase-admin/firestore");
const path = require("path");
const serviceAccount = require(path.join(__dirname, '../../serviceAccountKey.json')); // Admin SDK service account key

// Firebase client-side configuration

const firebaseConfig = {
  apiKey: "AIzaSyCjVUnvVelC9pMYWUVoIDl2wQxfbn8QT1I",
  authDomain: "paybills-flynexus.firebaseapp.com",
  projectId: "paybills-flynexus",
  storageBucket: "paybills-flynexus.appspot.com",
  messagingSenderId: "16435828447",
  appId: "1:16435828447:web:8236aa38cde458580b7b6a",
  measurementId: "G-EYQXKXT49K"
};

// Initialize Firebase app for client-side
const app = initializeClientApp(firebaseConfig);

// Initialize Firebase services (client-side)
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getClientFirestore(app); // Firestore for client-side

// Initialize Firebase Admin SDK for server-side
initializeAdminApp({
  credential: cert(serviceAccount), // Use the service account key
  projectId: firebaseConfig.projectId, // Ensure projectId is set for Admin SDK
});

// Firestore for server-side operations (Admin SDK)
const adminDb = getAdminFirestore();

module.exports = { app, auth, provider, db, adminDb };
