'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { ColorModeProvider } from './color-mode'
import { system } from '../../theme'

// The dashboard is designed for dark mode only
export function Provider(props) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider forcedTheme='dark' {...props} />
    </ChakraProvider>
  )
}
