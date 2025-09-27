'use client'

import { Box, VStack, Heading, Text, Avatar, Button } from '@chakra-ui/react'

export default function ProfileAboutPage() {
  return (
    <VStack align="stretch" gap={8}>
      {/* Profile card */}
      <Box
        borderWidth="1px"
        borderRadius="2xl"
        shadow="sm"
        bg="white"
        _dark={{ bg: 'gray.800', borderColor: 'gray.700' }}
        p={8}
        textAlign="center"
      >
        <VStack gap={3}>
          <Avatar.Root size="2xl">
            {/* If you have a photo: <Avatar.Image src="/me.jpg" alt="Your Name" /> */}
            <Avatar.Fallback name="Cloud" />
          </Avatar.Root>
          <Heading size="md">Cloud</Heading>
          <Text color="gray.500" _dark={{ color: 'gray.400' }}>
            Guest
          </Text>
          <Button colorScheme="teal" variant="outline" size="sm">
            Edit profile
          </Button>
        </VStack>
      </Box>

      {/* Callout */}
      <Box
        borderWidth="1px"
        borderRadius="2xl"
        shadow="sm"
        bg="white"
        _dark={{ bg: 'gray.800', borderColor: 'gray.700' }}
        p={6}
      >
        <Heading size="md" mb={2}>Complete your profile</Heading>
        <Text color="gray.600" _dark={{ color: 'gray.300' }} mb={4}>
          Add a photo and a short bio so hosts and guests can get to know you.
        </Text>
        <Button colorScheme="pink" size="sm">Get started</Button>
      </Box>
    </VStack>
  )
}
