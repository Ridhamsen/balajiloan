# Balaji Loan - Personal Loan Application

A production-grade loan lending application built with Next.js 14, featuring borrower onboarding, loan applications, admin dashboard, and comprehensive loan management.

## 🚀 Features

### Borrower Features
- **Authentication**: OTP-based phone number authentication
- **Profile Management**: Complete KYC and profile setup
- **Loan Application**: Multi-step loan application with real-time eligibility check
- **Loan Offers**: Dynamic loan offers with EMI calculations
- **Digital Agreement**: PDF generation and e-signature integration
- **Disbursal Management**: Mock payment processing and disbursal tracking
- **Repayment Tracking**: EMI schedule and payment management
- **Support System**: In-app chat and ticket system

### Admin Features
- **Dashboard**: Comprehensive KPIs and analytics
- **Application Management**: Review, approve, or reject loan applications
- **Borrower Management**: View and manage borrower profiles and KYC
- **Disbursal Management**: Process and track loan disbursals
- **Repayment Tracking**: Monitor payments and overdue amounts
- **Risk Assessment**: Automated risk scoring and reporting
- **Support Management**: Handle customer support tickets

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth with OTP verification
- **Payments**: Razorpay integration (mocked for development)
- **File Handling**: Local file uploads with PDF generation
- **UI Components**: Radix UI primitives with custom styling

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ and npm
- PostgreSQL database
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd balaji-loan
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/balaji_loan?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OTP Service (Mock)
OTP_SECRET="your-otp-secret-key"

# Payment Gateway (Mock)
RAZORPAY_KEY_ID="your-razorpay-key"
RAZORPAY_KEY_SECRET="your-razorpay-secret"

# File Upload
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE="5242880" # 5MB

# App Configuration
APP_NAME="Balaji Loan"
APP_URL="http://localhost:3000"
```

### 4. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database with sample data
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
balaji-loan/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts               # Database seeding
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/             # API routes
│   │   ├── auth/            # Authentication pages
│   │   ├── dashboard/       # Borrower dashboard
│   │   ├── admin/           # Admin dashboard
│   │   └── globals.css      # Global styles
│   ├── components/          # Reusable components
│   │   ├── ui/             # Base UI components
│   │   └── dashboard/       # Dashboard-specific components
│   ├── lib/                # Utility functions
│   │   ├── auth.ts         # Authentication configuration
│   │   ├── prisma.ts       # Prisma client
│   │   └── utils.ts        # Helper functions
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
└── README.md
```

## 🗄 Database Schema

### Core Models

- **User**: User accounts with phone/email authentication
- **Profile**: Extended user information and KYC data
- **LoanProduct**: Available loan products with terms
- **LoanApplication**: Loan applications with status tracking
- **Offer**: Generated loan offers with terms
- **Agreement**: Digital loan agreements
- **Disbursement**: Loan disbursal tracking
- **Repayment**: EMI and payment tracking
- **Ticket**: Customer support tickets

## 🔐 Authentication

The application uses NextAuth.js with a custom OTP-based authentication system:

1. User enters phone number
2. System generates and sends OTP (mocked for development)
3. User verifies OTP to complete authentication
4. Session is created with user role and profile information

## 💰 Loan Application Flow

1. **Product Selection**: Choose from available loan products
2. **Amount & Tenure**: Enter desired amount and repayment period
3. **Personal Information**: Provide employment and income details
4. **Risk Assessment**: Automated risk scoring based on provided data
5. **Review & Submit**: Final review before submission
6. **Admin Review**: Admin reviews and approves/rejects application
7. **Offer Generation**: Approved applications receive loan offers
8. **Agreement Signing**: Digital agreement generation and e-signature
9. **Disbursal**: Loan amount disbursed to borrower's account
10. **Repayment**: EMI tracking and payment processing

## 🎨 UI/UX Features

- **Mobile-First Design**: Responsive design optimized for mobile devices
- **Modern UI**: Clean, professional interface with Balaji Loan branding
- **Progress Indicators**: Multi-step forms with clear progress tracking
- **Real-time Validation**: Form validation with helpful error messages
- **Status Badges**: Color-coded status indicators throughout the app
- **Interactive Components**: Smooth animations and transitions

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
```

### Key Utilities

- **EMI Calculation**: `calculateEMI()` for loan EMI calculations
- **Risk Scoring**: `calculateRiskScore()` for automated risk assessment
- **Formatting**: Currency, date, and phone number formatting
- **Validation**: Phone, PAN, and Aadhaar number validation
- **Status Management**: Color coding and status handling

## 🚀 Deployment

### Environment Variables

Ensure all required environment variables are set in your production environment:

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="your-production-url"
NEXTAUTH_SECRET="your-production-secret"
# ... other variables
```

### Database Migration

```bash
# Run migrations in production
npm run db:migrate

# Generate Prisma client
npm run db:generate
```

### Build and Deploy

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 🔒 Security Features

- **Input Validation**: Comprehensive validation on all user inputs
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **Authentication**: Secure session management with NextAuth
- **File Upload Security**: File type and size validation
- **Rate Limiting**: API rate limiting for sensitive endpoints
- **Data Encryption**: Sensitive data encryption in transit and at rest

## 📱 Mobile Optimization

- **Responsive Design**: Optimized for all screen sizes
- **Touch-Friendly**: Large touch targets and intuitive gestures
- **Fast Loading**: Optimized images and code splitting
- **Offline Support**: Basic offline functionality for key features

## 🧪 Testing

The application includes comprehensive testing setup:

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📊 Monitoring & Analytics

- **Error Tracking**: Comprehensive error logging and monitoring
- **Performance Metrics**: Core Web Vitals and performance tracking
- **User Analytics**: User behavior and conversion tracking
- **Business Metrics**: Loan application and approval rates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Email**: support@balajiloan.com
- **Phone**: +91 9876543210
- **Documentation**: [Link to detailed docs]

## 🎯 Roadmap

- [ ] Advanced risk assessment algorithms
- [ ] Integration with credit bureaus
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Automated loan approval system
- [ ] Integration with multiple payment gateways
- [ ] Advanced fraud detection
- [ ] Customer portal enhancements

---

**Balaji Loan** - Making personal loans accessible, fast, and secure. 🚀
