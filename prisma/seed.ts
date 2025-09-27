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
  
  // Helper function to get random images
  const getRandomImages = (count: number): string[] => {
    const selected: string[] = [];
    for (let i = 0; i < count; i++) {
      const randomBlob = randomChoice(blobs);
      selected.push(randomBlob.url);
    }
    return selected;
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

      const baseData = {
        title:
          propertyType === PropertyType.APARTMENT
            ? "Apartment Listing"
            : "House Listing",
        address: `${randomInt(100, 999)} Example St`,
        description:
          propertyType === PropertyType.APARTMENT
            ? "Spacious apartment close to campus."
            : "Charming house with a yard, great for roommates.",
        property_type: propertyType,
        location: randomChoice(Object.values(Location)),
        distance_in_miles: randomInt(1, 5),
        price: randomInt(600, 2000),
        num_rooms_available: randomInt(1, 3),
        total_rooms: randomInt(2, 5),
        number_roommates: randomInt(0, 3),
        utilities_included: Math.random() > 0.5,
        sqft: randomInt(500, 2500),
        imageUrls: imageUrls,
        start_date: new Date("2025-01-01"),
        end_date: new Date("2025-12-31"),
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