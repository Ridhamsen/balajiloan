#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Balaji Loan Application...\n');

// Check if Node.js is installed
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  console.log(`✅ Node.js ${nodeVersion} detected`);
} catch (error) {
  console.error('❌ Node.js is not installed. Please install Node.js 18+ and try again.');
  process.exit(1);
}

// Check if npm is available
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`✅ npm ${npmVersion} detected`);
} catch (error) {
  console.error('❌ npm is not available. Please install npm and try again.');
  process.exit(1);
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies');
  process.exit(1);
}

// Create .env.local file if it doesn't exist
const envPath = '.env.local';
if (!fs.existsSync(envPath)) {
  console.log('\n📝 Creating environment file...');
  const envContent = `# Database
DATABASE_URL="postgresql://username:password@localhost:5432/balaji_loan?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-${Math.random().toString(36).substr(2, 9)}"

# OTP Service (Mock)
OTP_SECRET="your-otp-secret-key-${Math.random().toString(36).substr(2, 9)}"

# Payment Gateway (Mock)
RAZORPAY_KEY_ID="your-razorpay-key"
RAZORPAY_KEY_SECRET="your-razorpay-secret"

# File Upload
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE="5242880" # 5MB

# App Configuration
APP_NAME="Balaji Loan"
APP_URL="http://localhost:3000"
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Environment file created');
} else {
  console.log('✅ Environment file already exists');
}

// Create uploads directory
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  console.log('\n📁 Creating uploads directory...');
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Uploads directory created');
} else {
  console.log('✅ Uploads directory already exists');
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Set up a PostgreSQL database');
console.log('2. Update the DATABASE_URL in .env.local with your database credentials');
console.log('3. Run: npm run db:generate');
console.log('4. Run: npm run db:push');
console.log('5. Run: npm run db:seed');
console.log('6. Run: npm run dev');
console.log('\n🌐 Open http://localhost:3000 to view the application');
console.log('\n📚 Check README.md for detailed documentation');
