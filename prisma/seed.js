const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Crea utente admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@chiama.io' },
    update: {},
    create: {
      email: 'admin@chiama.io',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Crea alcuni clienti di esempio
  const customers = await Promise.all([
    prisma.customer.upsert({
      where: { email: 'mario.rossi@example.com' },
      update: {},
      create: {
        name: 'Mario Rossi',
        email: 'mario.rossi@example.com',
        phone: '+39 123 456 7890',
        status: 'active',
        joinedAt: new Date(),
      },
    }),
    prisma.customer.upsert({
      where: { email: 'lucia.bianchi@example.com' },
      update: {},
      create: {
        name: 'Lucia Bianchi',
        email: 'lucia.bianchi@example.com',
        phone: '+39 098 765 4321',
        status: 'lead',
      },
    }),
  ]);

  // Crea alcuni prodotti di esempio
  const products = await Promise.all([
    prisma.product.upsert({
      where: { name: 'Piano Base' },
      update: {},
      create: {
        name: 'Piano Base',
        description: 'Piano base per piccole aziende',
        monthly: 29.99,
        kind: 'subscription',
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { name: 'Piano Pro' },
      update: {},
      create: {
        name: 'Piano Pro',
        description: 'Piano professionale per aziende',
        monthly: 99.99,
        kind: 'subscription',
        isActive: true,
      },
    }),
  ]);

  console.log('Database popolato con successo!');
  console.log('Admin user:', admin.email);
  console.log('Customers created:', customers.length);
  console.log('Products created:', products.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 