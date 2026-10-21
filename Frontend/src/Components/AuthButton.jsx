import { doSignInWithGoogle, doSignOut } from "../Firebase/auth";
import { Button } from "@chakra-ui/react";
import { useAuth } from "../Contexts/AuthContext";
import { toaster } from "./ui/toaster";

const AuthButton = () => {
    const { UserLoggedIn, loading, enabled } = useAuth();

    const onSubmit = async (e) => {
        e.preventDefault();

        if (UserLoggedIn) {
            try {
                await doSignOut();
            } catch (error) {
                console.error("Error signing out:", error);
            }
            return;
        }

        try {
            await doSignInWithGoogle();
        } catch (error) {
            console.error("Error signing in:", error);
            toaster.create({
                title: "Sign-in failed",
                description: error.code === "auth/popup-closed-by-user"
                    ? "The sign-in popup was closed before completion. Please try again."
                    : "An error occurred during sign-in. Please try again.",
                type: "error",
            });
        }
    };

    return (
        <Button
            size="sm"
            colorPalette={UserLoggedIn ? "red" : "teal"}
            variant="outline"
            p="2"
            onClick={onSubmit}
            disabled={!enabled || loading}
            title={enabled ? undefined : "Sign-in is not configured"}
        >
            {UserLoggedIn ? "Sign Out" : "Sign In"}
        </Button>
    );
};

export default AuthButton;
