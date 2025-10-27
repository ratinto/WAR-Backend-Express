import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database connection...\n');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!\n');
    
    // Check tables using Prisma's introspection
    console.log('📋 Checking database tables:\n');
    
    // Count records in each table
    const studentCount = await prisma.student.count();
    const washermanCount = await prisma.washerman.count();
    const orderCount = await prisma.order.count();
    
    console.log(`   Students table: ${studentCount} records`);
    console.log(`   Washerman table: ${washermanCount} records`);
    console.log(`   Orders table: ${orderCount} records`);
    
    console.log('\n✅ Database inspection complete!');
    console.log('✅ All tables exist and are accessible!\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
