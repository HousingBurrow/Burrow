'use client'

import {
  Box,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Image,
  Button,
} from '@chakra-ui/react'

export default function SavedHousesPage() {
  // Replace with real data later
  const houses = [
    {
      id: 1,
      title: 'Modern Apartment in the City',
      location: 'New York, NY',
      image: 'https://via.placeholder.com/800x500.png?text=House+1',
    },
    {
      id: 2,
      title: 'Cozy Cabin in the Woods',
      location: 'Aspen, CO',
      image: 'https://via.placeholder.com/800x500.png?text=House+2',
    },
    {
      id: 3,
      title: 'Beachfront Villa',
      location: 'Miami, FL',
      image: 'https://via.placeholder.com/800x500.png?text=House+3',
    },
  ]

  return (
    <VStack align="stretch" gap={6}>
      <Heading size="lg">Saved Houses</Heading>

      {houses.length === 0 ? (
        <Text color="gray.600" _dark={{ color: 'gray.300' }}>
          You haven’t saved any houses yet.
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          {houses.map((h) => (
            <Box
              key={h.id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              shadow="md"
              bg="white"
              _dark={{ bg: 'gray.800', borderColor: 'gray.700' }}
            >
              <Image
                src={h.image}
                alt={h.title}
                w="full"
                h="180px"
                objectFit="cover"
              />
              <Box p={4}>
                <Heading size="sm" mb={1}>{h.title}</Heading>
                <Text color="gray.600" _dark={{ color: 'gray.300' }}>
                  {h.location}
                </Text>
                <Button mt={3} colorScheme="teal" size="sm">
                  View details
                </Button>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </VStack>
  )
}
