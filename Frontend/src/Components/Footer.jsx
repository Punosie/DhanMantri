import { Separator } from "@chakra-ui/react";
import { Icon, Link } from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/react";
import { ImLinkedin2, ImGithub } from "react-icons/im";
import { PiInstagramLogoBold } from "react-icons/pi";

const LINKS = [
  { href: "https://www.linkedin.com/in/shubhankar-kaushik/", label: "LinkedIn", icon: <ImLinkedin2 /> },
  { href: "https://github.com/Punosie", label: "GitHub", icon: <ImGithub /> },
  { href: "https://www.instagram.com/shubhankar.2003/", label: "Instagram", icon: <PiInstagramLogoBold /> },
];

const Footer = () => {
  return (
    <Box as="footer" mt="2" p={2} textAlign="center" flex={1}>
      <Separator />
      <Box display="flex" justifyContent="center" alignItems="center" gap="6">
        <Text textAlign="center" m="2">
            Made with ❤️ by Shubhankar Kaushik
        </Text>
        {LINKS.map(({ href, label, icon }) => (
          <Link key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer">
            <Icon>{icon}</Icon>
          </Link>
        ))}
      </Box>
    </Box>
  );
};

export default Footer;
