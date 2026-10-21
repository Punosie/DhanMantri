import { loadAuth } from "./config.js";

export const doSignInWithGoogle = async () => {
    const { auth, GoogleAuthProvider, signInWithPopup } = await loadAuth();
    return signInWithPopup(auth, new GoogleAuthProvider());
};

export const doSignOut = async () => {
    const { auth, signOut } = await loadAuth();
    await signOut(auth);
};
