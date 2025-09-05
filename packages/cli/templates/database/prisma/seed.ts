import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();

async function main() {
  // Add your seed data here
  console.log('🌱 Seeding database...');
  
  // Example seed data
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
