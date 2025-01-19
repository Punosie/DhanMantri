import { Box, Button, Flex, HStack, Heading } from "@chakra-ui/react";
import {Avatar} from "../ui/avatar"

const Navbar = () => {
    return (
        <Box>
            <Flex
                bg="transparent"
                w="100%"
                h="10vh"
                px="5"
                justifyContent="space-between"
                alignItems="center"
            >
                {/* Logo Container */}
                <Box h="100%" w="auto">
                    <Box h="100%" w="auto">
                        <img
                            src="assets/Logo.png"
                            alt="DhanMantri Logo"
                            style={{
                                height: "100%",
                                width: "auto",
                                objectFit: "cover",
                            }}
                        />
                    </Box>
                </Box>

                {/* Navigation Links */}
                <HStack spacing="20px">
                    <Heading size="3xl">STOCK DASHBOARD</Heading>
                </HStack>

                {/* Sign-In Section */}
                <HStack spacing="20px">
                <Button size="sm" variant="ghost" colorPalette="red"> Sign out </Button>
                    <Avatar size="lg" name="Shubhankar Kaushik" variant ="outline" colorPalette="teal"/>
                </HStack>
            </Flex>
        </Box>
    );
};

export default Navbar;
