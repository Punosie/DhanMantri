import { createContext, useEffect, useState, useContext } from "react";
import { firebaseEnabled, loadAuth } from "../../Firebase/config.js";

const AuthContext = createContext();

// Start Firebase once the page is idle so it never delays the first paint
const whenIdle = (callback) =>
    window.requestIdleCallback ? window.requestIdleCallback(callback, { timeout: 2000 }) : setTimeout(callback, 200);

export function AuthProvider({ children }) {
    const [state, setState] = useState({ currentUser: null, loading: firebaseEnabled });

    useEffect(() => {
        if (!firebaseEnabled) return;
        let unsubscribe = () => {};
        let cancelled = false;
        whenIdle(() =>
            loadAuth().then(({ auth, onAuthStateChanged }) => {
                if (cancelled) return;
                unsubscribe = onAuthStateChanged(auth, (user) => setState({ currentUser: user, loading: false }));
            }),
        );
        return () => {
            cancelled = true;
            unsubscribe();
        };
    }, []);

    const value = {
        currentUser: state.currentUser,
        UserLoggedIn: Boolean(state.currentUser),
        loading: state.loading,
        photoURL: state.currentUser?.photoURL ?? null,
        enabled: firebaseEnabled,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};
