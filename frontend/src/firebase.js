import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAK-Z6oA4SrJfB_okgpQr2W1l1y1kmZt_g",
  authDomain: "medical-project-faa46.firebaseapp.com",
  projectId: "medical-project-faa46",
  storageBucket: "medical-project-faa46.firebasestorage.app",
  messagingSenderId: "745167430459",
  appId: "1:745167430459:web:3bdfcd75ca55dfeb340d1e",
  measurementId: "G-WJRR7MRQE6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
// Always show the account chooser rather than silently reusing whichever
// Google account the browser happens to be signed into.
googleProvider.setCustomParameters({ prompt: 'select_account' });
export default app;
