import { auth } from "./config.js";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export const doSignInWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        return result;
    } catch (error) {
        console.error("Sign-in failed:", error);
        throw error;
    }
};

export const doSignOut = async () => {
    try {
        await auth.signOut();
    } catch (error) {
        console.error("Sign-out failed:", error);
    }
};
