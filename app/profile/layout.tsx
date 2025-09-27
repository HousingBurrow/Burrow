'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Box,
  Flex,
  Grid,
  HStack,
  VStack,
  Heading,
  Text,
  Button,
  Separator,
} from '@chakra-ui/react'

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <Box>
      {/* ===== Navbar ===== */}
      <Flex
        as="header"
        w="full"
        bg="white"
        boxShadow="sm"
        px={8}
        py={4}
        align="center"
        justify="space-between"
        _dark={{ bg: 'gray.800' }}
      >
        <Text fontSize="xl" fontWeight="bold" color="gray.800" _dark={{ color: 'white' }}>
          BURROW
        </Text>

        <HStack gap={4}>
          {/* CHANGED: Profile -> Home */}
          <Button asChild variant="ghost" color="gray.800" _dark={{ color: 'white' }}>
            <Link href="/homepage">{/* use "/" if your home is at app/page.tsx */}
              Home
            </Link>
          </Button>
          <Button asChild variant="ghost" color="gray.800" _dark={{ color: 'white' }}>
            <Link href="/settings">Settings</Link>
          </Button>
          <Button colorScheme="blue">Logout</Button>
        </HStack>
      </Flex>

      {/* ===== Content area ===== */}
      <Box maxW="7xl" mx="auto" px={{ base: 4, md: 8 }} py={8}>
        <Heading size="lg" mb={6}>Profile</Heading>

        <Grid templateColumns={{ base: '1fr', lg: '260px 1fr' }} gap={8}>
          {/* Sidebar */}
          <VStack align="stretch" gap={3}>
            <SidebarItem
              href="/profile/about_me"
              label="About me"
              active={pathname.startsWith('/profile/about_me')}
            />
            <SidebarItem
              href="/profile/saved_houses"
              label="Saved houses"
              active={pathname.startsWith('/profile/saved_houses')}
            />
            <Separator />
          </VStack>

          {/* Page-specific content */}
          <Box>{children}</Box>
        </Grid>
      </Box>
    </Box>
  )
}

/* -------- Sidebar item helper -------- */
function SidebarItem({
  href,
  label,
  active = false,
}: {
  href: string
  label: string
  active?: boolean
}) {
  return (
    <Link href={href}>
      <HStack
        gap={3}
        p={3}
        borderRadius="xl"
        bg={active ? 'blackAlpha.50' : 'transparent'}
        _dark={{ bg: active ? 'whiteAlpha.200' : 'transparent' }}
        borderWidth={active ? '1px' : '0px'}
        borderColor={active ? 'blackAlpha.200' : 'transparent'}
        cursor="pointer"
        _hover={{ bg: 'blackAlpha.100', _dark: { bg: 'whiteAlpha.300' } }}
      >
        <Box w="8" h="8" borderRadius="full" bg="gray.200" _dark={{ bg: 'gray.600' }} />
        <Text fontWeight="medium">{label}</Text>
      </HStack>
    </Link>
  )
}
