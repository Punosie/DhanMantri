import { Box, Flex, HStack, Heading } from "@chakra-ui/react";
import AuthButton from "../AuthButton";
import { Avatar } from "../ui/avatar";
import { useAuth } from "../../Contexts/AuthContext";

const Navbar = () => {
    const { currentUser, UserLoggedIn, photoURL } = useAuth();

    return (
        <Box as="header">
            <Flex bg="transparent" w="100%" h="64px" px="5" justifyContent="space-between" alignItems="center" gap="4">
                {/* Logo Container */}
                <Box h="100%" py="2" flexShrink={0}>
                    <img src="/assets/logo-128.webp" alt="DhanMantri logo" width="48" height="48" style={{ height: "100%", width: "auto" }} />
                </Box>

                <HStack>
                    <Heading as="h1" size={{ base: "lg", md: "3xl" }} textAlign="center">STOCK DASHBOARD</Heading>
                </HStack>

                {/* Sign-In Section */}
                <HStack gap="5">
                    <AuthButton />
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
