// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvoOURIbolSDZCYp4NVSTQRUprRua-Dso",
  authDomain: "exotic-cash.firebaseapp.com",
  projectId: "exotic-cash",
  storageBucket: "exotic-cash.firebasestorage.app",
  messagingSenderId: "420035017640",
  appId: "1:420035017640:web:5edc7440fb5ba01574bb9d",
  measurementId: "G-YMWTY9Z16X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;
