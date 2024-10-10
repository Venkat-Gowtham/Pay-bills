

// // Firebase client-side SDK imports
// const { initializeApp: initializeClientApp } = require("firebase/app");
// const { getAuth, GoogleAuthProvider } = require("firebase/auth");
// const { getFirestore: getClientFirestore } = require("firebase/firestore");

// // Firebase Admin SDK imports
// const { initializeApp: initializeAdminApp, cert } = require("firebase-admin/app");
// const { getFirestore: getAdminFirestore } = require("firebase-admin/firestore");
// const path = require("path");
// const serviceAccount = require(path.join(__dirname, '../../serviceAccountKey.json')); // Admin SDK service account key

// // Firebase client-side configuration

// const firebaseConfig = {
//   apiKey: "AIzaSyCjVUnvVelC9pMYWUVoIDl2wQxfbn8QT1I",
//   authDomain: "paybills-flynexus.firebaseapp.com",
//   projectId: "paybills-flynexus",
//   storageBucket: "paybills-flynexus.appspot.com",
//   messagingSenderId: "16435828447",
//   appId: "1:16435828447:web:8236aa38cde458580b7b6a",
//   measurementId: "G-EYQXKXT49K"
// };

// // Initialize Firebase app for client-side
// const app = initializeClientApp(firebaseConfig);

// // Initialize Firebase services (client-side)
// const auth = getAuth(app);
// const provider = new GoogleAuthProvider();
// const db = getClientFirestore(app); // Firestore for client-side

// // Initialize Firebase Admin SDK for server-side
// initializeAdminApp({
//   credential: cert(serviceAccount), // Use the service account key
//   projectId: firebaseConfig.projectId, // Ensure projectId is set for Admin SDK
// });

// // Firestore for server-side operations (Admin SDK)
// const adminDb = getAdminFirestore();

// module.exports = { app, auth, provider, db, adminDb };


// Firebase client-side SDK imports
// Firebase client-side SDK imports
// Firebase client-side SDK imports
// const { initializeApp: initializeClientApp } = require("firebase/app");
// const { getAuth, GoogleAuthProvider } = require("firebase/auth");
// const { getFirestore: getClientFirestore } = require("firebase/firestore");

// // Firebase Admin SDK imports
// const { initializeApp: initializeAdminApp, cert } = require("firebase-admin/app");
// const { getFirestore: getAdminFirestore } = require("firebase-admin/firestore");
// const path = require("path");
// require('dotenv').config(); // Load environment variables from .env file

// // Firebase Admin SDK service account
// const serviceAccount = {
//   "type": process.env.FIREBASE_ADMIN_TYPE,
//   "project_id": process.env.FIREBASE_ADMIN_PROJECT_ID,
//   "private_key_id": process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
//   "private_key": process.env.FIREBASE_ADMIN_PRIVATE_KEY, // No need to replace line breaks
//   "client_email": process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
//   "client_id": process.env.FIREBASE_ADMIN_CLIENT_ID,
//   "auth_uri": process.env.FIREBASE_ADMIN_AUTH_URI,
//   "token_uri": process.env.FIREBASE_ADMIN_TOKEN_URI,
//   "auth_provider_x509_cert_url": process.env.FIREBASE_ADMIN_AUTH_PROVIDER_CERT_URL,
//   "client_x509_cert_url": process.env.FIREBASE_ADMIN_CLIENT_CERT_URL,
// };

// // Firebase client-side configuration
// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
//   measurementId: process.env.FIREBASE_MEASUREMENT_ID
// };

// // Initialize Firebase Admin SDK
// const adminApp = initializeAdminApp({
//   credential: cert(serviceAccount),
// });
// const adminDb = getAdminFirestore(adminApp);

// // Initialize Firebase client-side SDK
// const clientApp = initializeClientApp(firebaseConfig);
// const clientAuth = getAuth(clientApp);
// const clientProvider = new GoogleAuthProvider();
// const clientDb = getClientFirestore(clientApp);

// module.exports = { clientApp, clientAuth, clientProvider, clientDb, adminApp, adminDb };


import { initializeApp as initializeClientApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore as getClientFirestore } from "firebase/firestore";

// Firebase Admin SDK imports
import { initializeApp as initializeAdminApp, cert } from "firebase-admin/app";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";
import path from "path";
import dotenv from 'dotenv'; // Import dotenv

dotenv.config(); // Load environment variables from .env file

// Firebase Admin SDK service account
const serviceAccount = {
  type: process.env.FIREBASE_ADMIN_TYPE,
  project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
  private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY, // No need to replace line breaks
  client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
  auth_uri: process.env.FIREBASE_ADMIN_AUTH_URI,
  token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_ADMIN_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_CERT_URL,
};

// Firebase client-side configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase Admin SDK
const adminApp = initializeAdminApp({
  credential: cert(serviceAccount),
});
const adminDb = getAdminFirestore(adminApp);

// Initialize Firebase client-side SDK
const clientApp = initializeClientApp(firebaseConfig);
const clientAuth = getAuth(clientApp);
const clientProvider = new GoogleAuthProvider();
const clientDb = getClientFirestore(clientApp);

export { clientApp, clientAuth, clientProvider, clientDb, adminApp, adminDb };
