import { Separator } from "@chakra-ui/react";
import { Icon, Link } from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/react";
import { ImLinkedin2, ImGithub } from "react-icons/im";
import { PiInstagramLogoBold } from "react-icons/pi";

const Footer = () => {
  return (
    <Box mt="2" p={2} textAlign="center" flex={1}>
      <Separator />
      <Box display="flex" justifyContent="center" gap="6">
        <Text textAlign="center" m="2">
            Made with ❤️ by Shubhankar Kaushik
        </Text>
        <Link href="https://www.linkedin.com/in/shubhankar-kaushik/" aria-label="LinkedIn" >
        <Icon>
            <ImLinkedin2 />
        </Icon>
        </Link>
        <Link href="https://github.com/Punosie" aria-label="GitHub">
            <Icon>
                <ImGithub />
            </Icon>
        </Link>
        <Link href="https://www.instagram.com/shubhankar.2003/" aria-label="Instagram" >
            <Icon>
                <PiInstagramLogoBold />
            </Icon>
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
