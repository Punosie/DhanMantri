const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain);

let authPromise;

// Firebase is loaded on demand so it stays out of the initial bundle
export const loadAuth = () =>
  (authPromise ??= Promise.all([import("firebase/app"), import("firebase/auth")]).then(
    ([{ initializeApp }, authModule]) => ({
      ...authModule,
      auth: authModule.getAuth(initializeApp(firebaseConfig)),
    }),
  ));
