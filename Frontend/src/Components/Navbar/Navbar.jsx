import { Box, Flex, HStack, Heading } from "@chakra-ui/react";
import AuthButton from "../AuthButton";
import { Avatar } from "../ui/avatar"; // Assuming Avatar component is properly set up
import { useAuth } from "../../Contexts/AuthContext";

const Navbar = () => {
    const { currentUser, UserLoggedIn, photoURL } = useAuth();

    return (
        <Box>
            <Flex bg="transparent" w="100%" h="5vh" px="5" justifyContent="space-between" alignItems="center">
                {/* Logo Container */}
                <Box h="100%" w="auto">
                    <Box h="100%" w="auto">
                        <img src="assets/Logo.png" alt="DhanMantri Logo" style={{ height: "100%", width: "auto", objectFit: "cover" }} />
                    </Box>
                </Box>

                {/* Navigation Links */}
                <HStack spacing="20px">
                    <Heading size="3xl">STOCK DASHBOARD</Heading>
                </HStack>

                {/* Sign-In Section */}
                <HStack spacing="20px">
                    <AuthButton />
                    {/* Conditional Avatar rendering */}
                    <Avatar
                        size="lg"
                        name={UserLoggedIn ? currentUser?.displayName || "Guest" : "Guest"}
                        src={UserLoggedIn ? photoURL || "/assets/Avatar.png" : undefined} // Only show photoURL if logged in
                        variant="outline"
                        colorPalette="teal"
                    />
                </HStack>
            </Flex>
        </Box>
    );
};

export default Navbar;
