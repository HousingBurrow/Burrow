'use client';

import React, { useState, useTransition } from 'react';
import {
  Box, Container, Tabs, Field, Input, Select, Switch, Button, Avatar, Text, Heading,
  Card, Alert, HStack, VStack, IconButton, createListCollection, Separator
} from '@chakra-ui/react';
import { FiUser, FiSettings, FiBell, FiShield, FiCamera, FiTrash2 } from 'react-icons/fi';
import { updateUser } from '../../lib/queries/users';

const genders = ['Male', 'Female', 'Other', 'Prefer not to say'] as const;
type Gender = (typeof genders)[number];

const locations = ['Midtown', 'WestMidtown', 'HomePark', 'NorthAvenue'] as const;
type DefaultLocation = (typeof locations)[number];

const genderCollection = createListCollection({
  items: genders.map(x => ({ label: x, value: x }))
});
const locationCollection = createListCollection({
  items: locations.map(x => ({ label: x, value: x }))
});

type SettingsState = {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  gender: Gender;
  notifications: boolean;
  darkMode: boolean;
  defaultLocation: DefaultLocation;
};

export default function ClientSettings({
  userId,
  initial,
}: {
  userId: number;
  initial: SettingsState;
}) {
  const [formData, setFormData] = useState<SettingsState>(initial);
  const [saving, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const pageBg = 'gray.50';
  const cardBg = 'white';
  const border  = 'gray.200';
  const muted   = 'gray.600';
  const strong  = 'gray.800';


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'age' ? Number(value) : value),
    }) as SettingsState);
  };

  const handleSwitchChange = (name: keyof SettingsState) => (details: { checked: boolean }) => {
    setFormData(prev => ({ ...prev, [name]: details.checked }));
  };

  const handleSave = () => {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const res = await updateUser({
        id: userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        age: formData.age,
        gender: formData.gender,
      });
      if (res.isError) setError(res.message || 'An error occurred');
      else setSaved(true);
    });
  };

  return (
    <Box bg={pageBg} minH="100vh" py={{ base: 6, md: 10 }}>
      <Container maxW="4xl" px={{ base: 4, md: 6 }}>
        <VStack align="stretch" gap={6}>
          <Heading size="lg" color={strong}>Settings</Heading>

          {error && (
            <Alert.Root status="error" borderRadius="lg">
              <Alert.Indicator />
              <Box>
                <Alert.Title>Couldn’t save changes</Alert.Title>
                <Alert.Description>{error}</Alert.Description>
              </Box>
            </Alert.Root>
          )}

          {saved && !error && (
            <Alert.Root status="success" borderRadius="lg">
              <Alert.Indicator />
              <Box>
                <Alert.Title>Saved</Alert.Title>
                <Alert.Description>Your settings have been updated.</Alert.Description>
              </Box>
            </Alert.Root>
          )}

          <Card.Root bg={cardBg} borderWidth="1px" borderColor={border} shadow="sm" rounded="2xl" overflow="hidden">
            <Tabs.Root defaultValue="profile" variant="line" colorScheme="gray">
              <Tabs.List px={{ base: 4, md: 6 }} py={2} borderBottomWidth="1px" borderColor={border}>
                <HStack gap={2} wrap="wrap">
                  <Tabs.Trigger value="profile"><HStack gap={2}><FiUser /><Text>Profile</Text></HStack></Tabs.Trigger>
                  <Tabs.Trigger value="preferences"><HStack gap={2}><FiSettings /><Text>Preferences</Text></HStack></Tabs.Trigger>
                  <Tabs.Trigger value="notifications"><HStack gap={2}><FiBell /><Text>Notifications</Text></HStack></Tabs.Trigger>
                  <Tabs.Trigger value="privacy"><HStack gap={2}><FiShield /><Text>Privacy</Text></HStack></Tabs.Trigger>
                </HStack>
              </Tabs.List>

              {/* PROFILE */}
              <Tabs.Content value="profile">
                <VStack gap={8} align="stretch" px={{ base: 4, md: 10 }} py={{ base: 6, md: 8 }}>
                  {/* Profile picture */}
                  <HStack gap={5} align="center">
                    <Box pos="relative">
                      <Avatar.Root size="2xl" bg="blue.500">
                        <Avatar.Fallback fontSize="2xl" fontWeight="bold">
                          {(formData.firstName[0] || 'U').toUpperCase()}
                          {(formData.lastName[0] || '').toUpperCase()}
                        </Avatar.Fallback>
                      </Avatar.Root>
                      <IconButton
                        aria-label="Upload photo"
                        size="sm"
                        colorScheme="blue"
                        variant="solid"
                        rounded="full"
                        pos="absolute"
                        bottom={0}
                        right={0}
                        shadow="md"
                      >
                        <FiCamera />
                      </IconButton>
                    </Box>
                    <VStack align="start" gap={1}>
                      <Text fontWeight="medium" color={strong}>Upload a new profile picture</Text>
                      <Text fontSize="sm" color={muted}>JPG, PNG or GIF. Max size 2MB.</Text>
                    </VStack>
                  </HStack>

                  <Separator borderColor={border} />

                  {/* Personal info */}
                  <VStack align="stretch" gap={6}>
                    <Text fontSize="md" fontWeight="semibold" color={strong}>Personal Information</Text>

                    <HStack gap={4} align="start">
                      <Field.Root flex="1">
                        <Field.Label color={muted}>First Name</Field.Label>
                        <Input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          bg={cardBg}
                          borderColor={border}
                          _hover={{ borderColor: border }}
                          _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                        />
                      </Field.Root>
                      <Field.Root flex="1">
                        <Field.Label color={muted}>Last Name</Field.Label>
                        <Input
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          bg={cardBg}
                          borderColor={border}
                          _hover={{ borderColor: border }}
                          _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                        />
                      </Field.Root>
                    </HStack>

                    <HStack gap={4} align="start">
                      <Field.Root flex="2">
                        <Field.Label color={muted}>Email Address</Field.Label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          bg={cardBg}
                          borderColor={border}
                          _hover={{ borderColor: border }}
                          _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                        />
                      </Field.Root>
                      <Field.Root flex="1">
                        <Field.Label color={muted}>Age</Field.Label>
                        <Input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          bg={cardBg}
                          borderColor={border}
                          _hover={{ borderColor: border }}
                          _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                        />
                      </Field.Root>
                    </HStack>

                    <Field.Root maxW="sm">
                      <Field.Label color={muted}>Gender</Field.Label>
                      <Select.Root
                        collection={genderCollection}
                        multiple={false as const}
                        value={[formData.gender]}
                        onValueChange={(d) => setFormData(p => ({ ...p, gender: d.value[0] as Gender }))}
                      >
                        <Select.Trigger bg={cardBg} borderColor={border} />
                        <Select.Positioner>
                          <Select.Content>
                            {genderCollection.items.map((item) => (
                              <Select.Item key={item.value} item={item}>
                                <Select.ItemText>{item.label}</Select.ItemText>
                                <Select.ItemIndicator>✓</Select.ItemIndicator>
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Select.Root>
                    </Field.Root>
                  </VStack>
                </VStack>
              </Tabs.Content>

              {/* PREFERENCES */}
              <Tabs.Content value="preferences">
                <VStack gap={8} align="stretch" px={{ base: 4, md: 10 }} py={{ base: 6, md: 8 }}>
                  <Text fontSize="md" fontWeight="semibold" color={strong}>App Preferences</Text>

                  <HStack justify="space-between" align="center" p={4} bg="gray.50" rounded="lg" borderWidth="1px" borderColor={border}>
                    <VStack align="start" gap={1}>
                      <Text fontWeight="medium" color={strong}>Dark Mode</Text>
                      <Text fontSize="sm" color={muted}>Toggle dark theme</Text>
                    </VStack>
                    <Switch.Root checked={formData.darkMode} onCheckedChange={handleSwitchChange('darkMode')}>
                      <Switch.Control><Switch.Thumb /></Switch.Control>
                    </Switch.Root>
                  </HStack>

                  <Field.Root maxW="sm">
                    <Field.Label color={muted}>Default Search Location</Field.Label>
                    <Select.Root
                      collection={locationCollection}
                      multiple={false as const}
                      value={[formData.defaultLocation]}
                      onValueChange={(d) => setFormData(p => ({ ...p, defaultLocation: d.value[0] as DefaultLocation }))}
                    >
                      <Select.Trigger bg={cardBg} borderColor={border} />
                      <Select.Positioner>
                        <Select.Content>
                          {locationCollection.items.map((item) => (
                            <Select.Item key={item.value} item={item}>
                              <Select.ItemText>{item.label}</Select.ItemText>
                              <Select.ItemIndicator>✓</Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Select.Root>
                  </Field.Root>
                </VStack>
              </Tabs.Content>

              {/* NOTIFICATIONS */}
              <Tabs.Content value="notifications">
                <VStack gap={6} align="stretch" px={{ base: 4, md: 10 }} py={{ base: 6, md: 8 }}>
                  <Text fontSize="md" fontWeight="semibold" color={strong}>Notifications</Text>
                  <HStack justify="space-between" align="center" p={4} bg="gray.50" rounded="lg" borderWidth="1px" borderColor={border}>
                    <VStack align="start" gap={1}>
                      <Text fontWeight="medium" color={strong}>Email Notifications</Text>
                      <Text fontSize="sm" color={muted}>Get updates about new listings</Text>
                    </VStack>
                    <Switch.Root checked={formData.notifications} onCheckedChange={handleSwitchChange('notifications')}>
                      <Switch.Control><Switch.Thumb /></Switch.Control>
                    </Switch.Root>
                  </HStack>
                </VStack>
              </Tabs.Content>

              {/* PRIVACY */}
              <Tabs.Content value="privacy">
                <VStack gap={6} align="stretch" px={{ base: 4, md: 10 }} py={{ base: 6, md: 8 }}>
                  <Text fontSize="md" fontWeight="semibold" color={strong}>Privacy & Security</Text>
                  <Alert.Root status="error" rounded="lg" borderWidth="1px" borderColor={border}>
                    <Alert.Indicator />
                    <VStack align="start" gap={3}>
                      <Box>
                        <Alert.Title>Danger Zone</Alert.Title>
                        <Alert.Description fontSize="sm">
                          Once you delete your account, there is no going back.
                        </Alert.Description>
                      </Box>
                      <Button colorScheme="red" size="sm">
                    <HStack gap={2}>
                      <FiTrash2 />
                      <span>Delete Account</span>
                    </HStack>
                  </Button>
                    </VStack>
                  </Alert.Root>
                </VStack>
              </Tabs.Content>
            </Tabs.Root>

            {/* Footer */}
            <HStack justify="flex-end" gap={3} px={{ base: 4, md: 10 }} py={{ base: 4, md: 6 }} borderTopWidth="1px" borderColor={border} bg="gray.50">
              <Button variant="ghost" disabled={saving}>Cancel</Button>
              <Button colorScheme="blue" onClick={handleSave} loading={saving} px={6}>
                Save Changes
              </Button>
            </HStack>
          </Card.Root>
        </VStack>
      </Container>
    </Box>
  );
}
