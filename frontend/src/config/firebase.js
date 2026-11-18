import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCwSqZcccTEJH_X-IvsW93gClDvYBQVEzQ",
  authDomain: "ai-interview-platform-ec652.firebaseapp.com",
  projectId: "ai-interview-platform-ec652",
  storageBucket: "ai-interview-platform-ec652.firebasestorage.app",
  messagingSenderId: "645522117744",
  appId: "1:645522117744:web:08d811aac5aa7cdf9dd0b5",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

export default app;