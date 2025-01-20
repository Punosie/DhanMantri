import { createContext, useEffect, useState, useContext } from "react";
import { auth } from "../../Firebase/config.js";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [UserLoggedIn, setUserLoggedIn] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, initialiseUser);
        return unsubscribe;
    }, []);

    async function initialiseUser(user) {
        if (user) {
            setCurrentUser({ ...user });
            setUserLoggedIn(true);
        } else {
            setCurrentUser(null);
            setUserLoggedIn(false);
        }
        setLoading(false);
    }

    const value = {
        currentUser,
        UserLoggedIn,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};
