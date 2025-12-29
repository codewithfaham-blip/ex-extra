import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDvoOURIbolSDZCYp4NVSTQRUprRua-Dso",
  authDomain: "exotic-cash.firebaseapp.com",
  projectId: "exotic-cash",
  storageBucket: "exotic-cash.firebasestorage.app",
  messagingSenderId: "420035017640",
  appId: "1:420035017640:web:5edc7440fb5ba01574bb9d",
  measurementId: "G-YMWTY9Z16X"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;