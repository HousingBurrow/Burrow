"use client";

import {
  Flex,
  Input,
  Button,
  HStack,
  VStack,
  Box,
  Text,
  Separator,
  Grid,
  GridItem,
  Image,
  NativeSelect,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import React, { useState, FC } from "react";

export const SearchBar: FC = () => {
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rooms, setRooms] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = () => {
    console.log({ location, startDate, endDate, rooms });
  };

  const locations = ["Midtown", "North Avenue", "Home Park", "West Midtown"];

  return (
    <HStack
      maxW="1000px"
      w="full"
      borderRadius="full"
      boxShadow={isFocused ? "md" : "sm"}
      border="1px solid"
      borderColor={isFocused ? "blue.400" : "gray.200"}
      overflow="hidden"
      transition="all 0.2s"
      px={4}
      py={2}
      bg="white"
    >
      {/* Location NativeSelect */}
      <VStack flex={2} gap={1} align="stretch" px={4}>
        <Text fontSize="s" color="gray.800">
          Where
        </Text>
        <NativeSelect.Root size="md" width="100%">
          <NativeSelect.Field
            placeholder="Select location"
            value={location}
            onChange={(e) => setLocation(e.currentTarget.value)}
            _focus={{ boxShadow: "none" }}
            color="gray.800"
            border="none"
            bg="transparent"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </VStack>

      {/* Divider */}
      <Separator orientation="vertical" h="48px" />

      {/* Start Date */}
      <VStack flex={1} gap={1} align="stretch" px={4}>
        <Text fontSize="s" color="gray.800">
          Start Date
        </Text>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          border="none"
          color="black"
          _focus={{ boxShadow: "none" }}
        />
      </VStack>

      {/* Divider */}
      <Separator orientation="vertical" h="48px" />

      {/* End Date */}
      <VStack flex={1} gap={1} align="stretch" px={4}>
        <Text fontSize="s" color="gray.800">
          End Date
        </Text>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          border="none"
          color="black"
          _focus={{ boxShadow: "none" }}
        />
      </VStack>

      {/* Divider */}
      <Separator orientation="vertical" h="48px" />

      {/* Number of Rooms */}
      <VStack flex={1} gap={1} align="stretch" px={4}>
        <Text fontSize="s" color="gray.800">
          Rooms
        </Text>
        <Input
          type="number"
          min={1}
          placeholder="Number of Rooms"
          value={rooms}
          onChange={(e) => setRooms(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          border="none"
          color="black"
          _focus={{ boxShadow: "none" }}
        />
      </VStack>

      {/* Search Button */}
      <Button
        onClick={handleSearch}
        colorScheme="blue"
        borderRadius="full"
        ml={2}
      >
        <SearchIcon style={{ marginRight: "0.5em" }} />
        Search
      </Button>
    </HStack>
  );
};

export default function HomePage() {
  const listings = [
    {
      id: 1,
      title: "Cozy dorm near campus",
      location: "Georgia Tech",
      price: "$500/month",
      image: "https://via.placeholder.com/300x200",
    },
    
  ];

  return (
    <Flex direction="column" minH="100vh" bg="gray.50">
      {/* Header */}
      <Flex
        as="header"
        w="full"
        bg="white"
        boxShadow="sm"
        px={8}
        py={4}
        align="center"
        justify="space-between"
      >
        <Text fontSize="xl" fontWeight="bold" color="gray.800">
          BURROW
        </Text>
        <HStack gap={4}>
          <Button variant="ghost" color="gray.800" _hover={{ bg: "gray.300"}}>
            Profile
          </Button>
          <Button variant="ghost" color="gray.800" _hover={{ bg: "gray.300"}}>
            Settings
          </Button>
          <Button variant="ghost" color="gray.800" _hover={{ bg: "gray.300"}}>
            Logout
          </Button>
        </HStack>
      </Flex>

      {/* Search bar */}
      <Flex justify="center" mt={8} px={4}>
        <SearchBar />
      </Flex>

      {/* Listings */}
      <Box flex={1} px={8} py={6}>
        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
          {listings.map((listing) => (
            <GridItem
              key={listing.id}
              bg="white"
              borderRadius="md"
              boxShadow="sm"
              overflow="hidden"
            >
              <Image
                src={listing.image}
                alt={listing.title}
                objectFit="cover"
                w="100%"
                h="150px"
              />
              <VStack align="start" gap={1} p={4}>
                <Text fontWeight="bold" color="gray.800">
                  {listing.title}
                </Text>
                <Text fontSize="sm" color="gray.700">
                  {listing.location}
                </Text>
                <Text fontWeight="semibold" color="gray.800">
                  {listing.price}
                </Text>
              </VStack>
            </GridItem>
          ))}
        </Grid>
      </Box>
    </Flex>
  );
}
