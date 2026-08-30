// Firebase Configuration & Initializer Template
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export const getFirebaseConfig = (): FirebaseConfig => {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSy_demo_key_placeholder',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'sports-everything-v2.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'sports-everything-v2',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'sports-everything-v2.appspot.com',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1234567890:web:abcdef123456'
  };
};
