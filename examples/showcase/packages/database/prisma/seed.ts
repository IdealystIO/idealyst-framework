import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample items
  const items = await Promise.all([
    prisma.item.create({
      data: {
        title: 'Learn tRPC',
        description: 'Understand type-safe API calls with full TypeScript inference',
        completed: true,
      },
    }),
    prisma.item.create({
      data: {
        title: 'Learn GraphQL',
        description: 'Explore flexible queries with Apollo Client',
        completed: false,
      },
    }),
    prisma.item.create({
      data: {
        title: 'Build a showcase app',
        description: 'Create a demo app using the Idealyst framework',
        completed: false,
      },
    }),
    prisma.item.create({
      data: {
        title: 'Set up Prisma',
        description: 'Configure database with type-safe models',
        completed: true,
      },
    }),
    prisma.item.create({
      data: {
        title: 'Test API endpoints',
        description: 'Verify both tRPC and GraphQL are working correctly',
        completed: false,
      },
    }),
  ]);

  console.log(`✅ Created ${items.length} items`);
  console.log('✅ Seeding completed');
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
