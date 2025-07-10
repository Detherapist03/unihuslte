# UniHuslte - The Student Marketplace for Nigeria

**UniHuslte** is a peer-to-peer marketplace web application designed specifically for Nigerian university students. Built with modern web technologies, it provides a secure platform for students to buy and sell products and services within their campus communities.

## 🚀 Features

### 🔐 **Authentication System**
- **Email-based signup** with OTP verification using EmailJS
- **University email validation** to ensure only verified students can join
- **Secure login** with JWT token authentication
- **Password hashing** using bcrypt for enhanced security

### 🛒 **Marketplace Functionality**
- **Create listings** for products and services with images, descriptions, and tags
- **Advanced search and filtering** by category, campus, price range, and keywords
- **Real-time contact** via WhatsApp or email integration
- **Responsive design** optimized for mobile and desktop devices

### 📱 **Pages & Features**
- **Home Page**: Hero section with featured listings and category browsing
- **Marketplace**: Full listing grid with search, filters, and pagination
- **Listing Details**: Comprehensive item pages with seller information
- **User Profile**: Manage your listings, view sales history
- **Add/Edit Listings**: Rich form interface with image upload support
- **Mobile Navigation**: Sticky bottom navigation for mobile users

### 🔒 **Safety & Security**
- **Email verification** required for all users
- **University-based filtering** to connect with fellow students
- **Safety tips** and guidelines for secure transactions
- **Direct contact** without exposing personal information publicly

## 🛠 Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS with custom components
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Email Service**: EmailJS for OTP verification
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Deployment**: Vercel-ready configuration

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **EmailJS account** (for OTP verification)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd unihuslte
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT Secret (change this in production)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Email.js Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID="your_service_id"
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID="your_template_id"
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY="your_public_key"

# NextAuth (optional for future features)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key"
```

### 4. Set Up EmailJS (Required for OTP)

1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Create a new email service (Gmail, Outlook, etc.)
3. Create an email template with the following variables:
   - `{{to_email}}` - Recipient email
   - `{{to_name}}` - Recipient name
   - `{{otp_code}}` - The OTP code
   - `{{app_name}}` - App name (UniHuslte)
4. Update your `.env.local` with the service ID, template ID, and public key

### 5. Set Up the Database

```bash
# Generate Prisma client
npx prisma generate

# Create and migrate the database
npx prisma db push

# Seed the database with sample data
npm run seed
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📧 Email Template for EmailJS

Create an email template in EmailJS with this structure:

```html
<h2>Welcome to UniHuslte!</h2>
<p>Hi {{to_name}},</p>
<p>Your verification code is: <strong>{{otp_code}}</strong></p>
<p>This code will expire in 10 minutes.</p>
<p>Best regards,<br>{{app_name}} Team</p>
```

## 🗄️ Database Schema

The application uses three main models:

- **University**: Nigerian universities data
- **User**: Student profiles with email verification
- **Listing**: Marketplace items with categories and tags

## 👥 Test Accounts

After running the seed script, you can log in with these test accounts:

| Email | Password | University |
|-------|----------|------------|
| john.adebayo@unilag.edu.ng | password123 | University of Lagos |
| sarah.okafor@ui.edu.ng | password123 | University of Ibadan |
| david.chukwu@oauife.edu.ng | password123 | Obafemi Awolowo University |
| grace.eze@unn.edu.ng | password123 | University of Nigeria, Nsukka |
| ahmed.hassan@abu.edu.ng | password123 | Ahmadu Bello University |

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 📝 Usage Guide

### For Students:

1. **Sign Up**: Use your university email to create an account
2. **Verify Email**: Enter the OTP sent to your email
3. **Browse Marketplace**: Explore listings by category or search
4. **Create Listings**: Add your own products or services
5. **Contact Sellers**: Use WhatsApp or email to connect with sellers

### For Developers:

- **API Routes**: Located in `src/app/api/`
- **Components**: Reusable UI components in `src/components/`
- **Database**: Prisma schema in `prisma/schema.prisma`
- **Styling**: TailwindCSS classes with custom utilities

## 🔧 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database with sample data
npx prisma studio    # Open Prisma database viewer
npx prisma db push   # Push schema changes to database
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [TailwindCSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Email service by [EmailJS](https://www.emailjs.com/)

---

**UniHuslte** - Connecting Nigerian students through secure, campus-based marketplace transactions. 🇳🇬📚💼
