import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();

async function main() {
  // Add your seed data here
  console.log('🌱 Seeding database...');
  
  // Create some test data for the Test model
  console.log('📝 Creating test entries...');
  
  const testEntries = await Promise.all([
    prisma.test.create({
      data: {
        name: 'API Connection Test',
        message: 'This test verifies that the API can connect to the database successfully.',
        status: 'active',
      },
    }),
    prisma.test.create({
      data: {
        name: 'Data Validation Test',
        message: 'This test ensures that data validation is working correctly across the stack.',
        status: 'active',
      },
    }),
    prisma.test.create({
      data: {
        name: 'tRPC Integration Test',
        message: 'This test confirms that tRPC endpoints are properly configured and accessible.',
        status: 'active',
      },
    }),
    prisma.test.create({
      data: {
        name: 'Sample Inactive Test',
        message: 'This is an example of an inactive test entry.',
        status: 'inactive',
      },
    }),
  ]);

  console.log(`✅ Created ${testEntries.length} test entries`);
  
  // Example seed data for other models (uncommented for reference)
  // const user = await prisma.user.create({
  //   data: {
  //     email: 'admin@example.com',
  //     name: 'Admin User',
  //   },
  // });
  
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
