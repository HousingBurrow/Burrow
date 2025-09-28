import {
  PrismaClient,
  PropertyType,
  RoomType,
  ApartmentType,
  Location,
} from "@prisma/client";
import { list } from '@vercel/blob';

const prisma = new PrismaClient();

const randomChoice = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Title adjectives and descriptors
const titleAdjectives = [
  "Cozy", "Spacious", "Modern", "Charming", "Bright", "Quiet", 
  "Stylish", "Comfortable", "Beautiful", "Sunny", "Updated", 
  "Fresh", "Lovely", "Perfect", "Amazing", "Great", "Nice",
  "Rustic", "Elegant", "Vintage", "Contemporary", "Minimalist",
  "Luxurious", "Affordable", "Peaceful", "Vibrant", "Classic"
];

const apartmentDescriptors = [
  "Studio", "Apartment", "Flat", "Unit", "Loft", "Place",
  "Penthouse", "Duplex", "Garden Apartment", "High-Rise Unit"
];

const houseDescriptors = [
  "House", "Home", "Cottage", "Place", "Townhouse", "Bungalow",
  "Victorian", "Craftsman", "Ranch", "Colonial", "Split-Level",
  "Farmhouse", "Cape Cod", "Tudor"
];

const locationDescriptors = [
  "Near Campus", "Close to University", "Downtown", "Uptown", 
  "Student Area", "Campus Adjacent", "University District"
];

// Generate a short, descriptive title
const generateTitle = (propertyType: PropertyType): string => {
  const adjective = randomChoice(titleAdjectives);
  const descriptor = propertyType === PropertyType.APARTMENT 
    ? randomChoice(apartmentDescriptors)
    : randomChoice(houseDescriptors);
  
  // Sometimes add a location descriptor
  if (Math.random() > 0.6) {
    const location = randomChoice(locationDescriptors);
    return `${adjective} ${descriptor} ${location}`;
  }
  
  return `${adjective} ${descriptor}`;
};

// Generate random dates
const generateRandomDates = (): { startDate: Date; endDate: Date } => {
  // Start dates can be from now through next 6 months
  const now = new Date();
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
  
  // Generate random start date
  const startTime = now.getTime() + Math.random() * (sixMonthsFromNow.getTime() - now.getTime());
  const startDate = new Date(startTime);
  
  // End date is 6-18 months after start date
  const minEndDate = new Date(startDate);
  minEndDate.setMonth(minEndDate.getMonth() + 6);
  
  const maxEndDate = new Date(startDate);
  maxEndDate.setMonth(maxEndDate.getMonth() + 18);
  
  const endTime = minEndDate.getTime() + Math.random() * (maxEndDate.getTime() - minEndDate.getTime());
  const endDate = new Date(endTime);
  
  return { startDate, endDate };
};

// Generate longer, more detailed descriptions
const generateDescription = (propertyType: PropertyType, distance: number, sqft: number, numRooms: number, utilitiesIncluded: boolean): string => {
  const baseDescriptions = {
    [PropertyType.APARTMENT]: [
      "This well-maintained apartment features modern amenities and plenty of natural light.",
      "Beautiful apartment with updated fixtures and a great layout for students.",
      "Spacious apartment perfect for students looking for comfort and convenience.",
      "Lovely apartment in a quiet building with easy access to campus.",
      "Modern apartment with contemporary finishes and great student-friendly features.",
      "Bright and airy apartment with excellent storage space and updated appliances."
    ],
    [PropertyType.HOUSE]: [
      "Charming house with a yard, perfect for students who want more space to relax.",
      "Beautiful house featuring multiple common areas and a great atmosphere for roommates.",
      "Spacious house with a large kitchen and living areas, ideal for group living.",
      "Well-maintained house with character and plenty of room for studying and socializing.",
      "Cozy house with outdoor space and a welcoming environment for students.",
      "Great house with modern updates while maintaining its original charm."
    ]
  };

  let description = randomChoice(baseDescriptions[propertyType]);
  
  // Add distance information
  if (distance === 1) {
    description += ` Located just ${distance} mile from campus, making your commute a breeze.`;
  } else {
    description += ` Conveniently located ${distance} miles from campus with easy transportation options.`;
  }
  
  // Add additional details
  const additionalDetails = [];
  
  if (sqft > 1500) {
    additionalDetails.push("The generous square footage provides plenty of room for comfortable living");
  } else if (sqft < 800) {
    additionalDetails.push("The efficient layout maximizes every square foot");
  }
  
  if (numRooms >= 4) {
    additionalDetails.push("multiple bedrooms offer privacy for all residents");
  }
  
  if (utilitiesIncluded) {
    additionalDetails.push("utilities are included in the rent for hassle-free budgeting");
  }
  
  if (additionalDetails.length > 0) {
    description += ` ${randomChoice(additionalDetails)}.`;
  }
  
  // Add a closing statement
  const closingStatements = [
    "Don't miss out on this great opportunity!",
    "Perfect for serious students who value quality living.",
    "Schedule a viewing today to see all this place has to offer.",
    "This won't last long in today's market.",
    "Ideal for students seeking a balance of comfort and convenience."
  ];
  
  description += ` ${randomChoice(closingStatements)}`;
  
  return description;
};

async function main() {
  console.log('Fetching images from Vercel Blob Storage...');
  
  // Fetch all images from blob storage
  const { blobs } = await list({
    token: process.env.BLOB_READ_WRITE_TOKEN!,
  });
  
  if (blobs.length === 0) {
    console.error('❌ No images found in blob storage!');
    console.log('Please upload images to Vercel Blob Storage first.');
    return;
  }
  
  console.log(`✅ Found ${blobs.length} images in blob storage`);
  
  // Helper function to get random images without duplicates
  const getRandomImages = (count: number): string[] => {
    const shuffled = [...blobs].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map(blob => blob.url);
  };

  console.log('Clearing existing data...');
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Database cleared');

  // Seed some users
  const users = await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.user.create({
        data: {
          email: `user${i + 1}@example.com`,
          first_name: `User${i + 1}`,
          last_name: `Test${i + 1}`,
          gender: i % 2 === 0 ? "Male" : "Female",
          age: randomInt(18, 30),
          pfp: "",
        },
      })
    )
  );

  console.log(`✅ Seeded ${users.length} users`);

  // Seed listings
  const listings = await Promise.all(
    Array.from({ length: 67 }).map(async (_, i) => {
      const lister = randomChoice(users);
      const propertyType = randomChoice([
        PropertyType.APARTMENT,
        PropertyType.HOUSE,
      ]);

      // Get 2-4 random images for each listing
      const numImages = randomInt(2, 4);
      const imageUrls = getRandomImages(numImages);
      
      const distance = randomInt(1, 5);
      const sqft = randomInt(500, 2500);
      const totalRooms = randomInt(2, 5);
      const numRoomsAvailable = randomInt(1, Math.min(3, totalRooms)); // Can't exceed total rooms
      const utilitiesIncluded = Math.random() > 0.5;
      const { startDate, endDate } = generateRandomDates();

      const baseData = {
        title: generateTitle(propertyType),
        address: `${randomInt(100, 999)} Example St`,
        description: generateDescription(propertyType, distance, sqft, totalRooms, utilitiesIncluded),
        property_type: propertyType,
        location: randomChoice(Object.values(Location)),
        distance_in_miles: distance,
        price: randomInt(600, 2000),
        num_rooms_available: numRoomsAvailable,
        total_rooms: totalRooms,
        number_roommates: randomInt(0, 3),
        utilities_included: utilitiesIncluded,
        sqft: sqft,
        imageUrls: imageUrls,
        start_date: startDate,
        end_date: endDate,
        lister_id: lister.id,
      };

      if (propertyType === PropertyType.APARTMENT) {
        return prisma.listing.create({
          data: {
            ...baseData,
            apartmentDetails: {
              create: {
                room_type: randomChoice(Object.values(RoomType)),
                apartment_type: randomChoice(Object.values(ApartmentType)),
              },
            },
          },
        });
      } else {
        return prisma.listing.create({
          data: {
            ...baseData,
            houseDetails: {
              create: {
                num_bathrooms: randomInt(1, 3),
                num_rooms: baseData.total_rooms,
              },
            },
          },
        });
      }
    })
  );

  console.log(
    `✅ Seeded ${users.length} users and ${listings.length} listings`
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });