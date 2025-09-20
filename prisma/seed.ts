import { PrismaClient, UserRole, EmploymentType, KYCStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { phone: '9999999999' },
    update: {},
    create: {
      phone: '9999999999',
      email: 'admin@balajiloan.com',
      role: UserRole.ADMIN,
    },
  })

  // Create admin profile
  await prisma.profile.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      name: 'Admin User',
      dateOfBirth: new Date('1990-01-01'),
      gender: 'Other',
      address: 'Admin Address',
      employmentType: EmploymentType.EMPLOYEE,
      monthlyIncome: 50000,
      kycStatus: KYCStatus.VERIFIED,
      panNumber: 'ABCDE1234F',
      aadhaarNumber: '123456789012',
    },
  })

  // Create loan products
  const products = [
    {
      name: 'Quick Cash',
      minAmount: 500,
      maxAmount: 5000,
      interestAPR: 24.0,
      tenureRange: '7-30',
      fees: 50,
    },
    {
      name: 'Student Loan',
      minAmount: 1000,
      maxAmount: 15000,
      interestAPR: 18.0,
      tenureRange: '15-60',
      fees: 100,
    },
    {
      name: 'Personal Loan',
      minAmount: 5000,
      maxAmount: 50000,
      interestAPR: 15.0,
      tenureRange: '30-90',
      fees: 200,
    },
  ]

  for (const product of products) {
    await prisma.loanProduct.create({
      data: product,
    })
  }

  // Create sample borrower
  const borrower = await prisma.user.upsert({
    where: { phone: '9876543210' },
    update: {},
    create: {
      phone: '9876543210',
      email: 'borrower@example.com',
      role: UserRole.BORROWER,
    },
  })

  // Create borrower profile
  await prisma.profile.upsert({
    where: { userId: borrower.id },
    update: {},
    create: {
      userId: borrower.id,
      name: 'John Doe',
      dateOfBirth: new Date('1995-05-15'),
      gender: 'Male',
      address: '123 Main Street, City, State',
      employmentType: EmploymentType.STUDENT,
      monthlyIncome: 15000,
      kycStatus: KYCStatus.VERIFIED,
      panNumber: 'PAN1234567',
      aadhaarNumber: '987654321098',
      studentId: 'STU123456',
    },
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
