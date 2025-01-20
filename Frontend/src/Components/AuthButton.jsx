import { doSignInWithGoogle } from "../Firebase/auth"0000;
import { Button } from "@chakra-ui/react";
import { useAuth } from "../Contexts/AuthContext";
import { useState } from "react";

const AuthButton = () => {
    const { UserLoggedIn } = useAuth();
    const [loggedIn, setLoggedIn] = useState(false);
    const [error, setError] = useState(null);

    const onSubmit = async (e) => {
        e.preventDefault();

        if (loggedIn) {
            // Handle sign-out
            try {
                await doSignOut();
                setLoggedIn(false);
            } catch (error) {
                console.error("Error signing out:", error);
            }
        } else {
            // Handle sign-in
            setLoggedIn(true);
            setError(null); // Clear previous errors
            try {
                await doSignInWithGoogle();
            } catch (error) {
                console.error("Error signing in:", error);
                setLoggedIn(false);
                if (error.code === 'auth/popup-closed-by-user') {
                    setError('The sign-in popup was closed before completion. Please try again.');
                } else {
                    setError('An error occurred during sign-in. Please try again.');
                }
            }
        }
    };

    return (
        <div>
            <Button
                size="sm"
                colorPalette={loggedIn ? "red" : "teal"}
                variant="outline"
                flex="1"
                p = "2"
                onClick={onSubmit}
            >
                {loggedIn ? "Sign Out" : "Sign In"}
            </Button>
            {error && <p>{error}</p>} {/* Display the error message */}
        </div>
    );
};

export default AuthButton;
