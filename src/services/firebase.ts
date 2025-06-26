import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Use the same Firebase config as the auth app
const firebaseConfig = {
  apiKey: "AIzaSyD8zKRcfJvNwFVBCKJEOmt3pVHgxV45Xws",
  authDomain: "arboreal-vision-339901.firebaseapp.com",
  databaseURL: "https://arboreal-vision-339901-default-rtdb.firebaseio.com",
  projectId: "arboreal-vision-339901",
  storageBucket: "arboreal-vision-339901.appspot.com",
  messagingSenderId: "337595765105",
  appId: "1:337595765105:web:2e0df04d5a786b24709c10",
  measurementId: "G-W9NQVJGWP1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Fetch user data from Firestore
export const fetchUserData = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};