# UniHuslte - The Student Marketplace for Nigeria

<div align="center">
  <img src="public/logo.png" alt="UniHuslte Logo" width="100" height="100" />
  <h3>Student-Powered Marketplace</h3>
  <p><em>Buy, sell, and discover amazing deals with fellow students across Nigerian universities</em></p>
</div>

## 🚀 Project Overview

UniHuslte is a comprehensive peer-to-peer marketplace web application designed specifically for Nigerian university students. Built with modern web technologies, it provides a secure and user-friendly platform for students to buy and sell items, services, and connect with their academic community.

## ✨ Features

### 🔐 Authentication System
- **User Registration**: Full name, university selection, email verification
- **Email Verification**: OTP-based email verification using EmailJS
- **Secure Login**: JWT-based authentication with HTTP-only cookies
- **University Integration**: 45+ Nigerian universities pre-loaded

### 🛒 Marketplace Features
- **Create Listings**: List items/services with images, descriptions, pricing
- **Advanced Search**: Filter by category, university, price range, keywords
- **Category Organization**: 8 main categories (Electronics, Books, Services, etc.)
- **Contact System**: Email and WhatsApp integration for buyer-seller communication
- **User Profiles**: Manage listings, view statistics, profile management

### 📱 Mobile-First Design
- **Responsive Layout**: Optimized for mobile devices
- **Bottom Navigation**: Sticky navigation for mobile users
- **Touch-Friendly**: Large buttons and intuitive gestures
- **Progressive Enhancement**: Works on all devices

### 🎨 Modern UI/UX
- **TailwindCSS**: Clean, modern styling
- **Component Library**: Reusable UI components
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages

## 🛠 Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first CSS framework
- **React Hook Form**: Form validation and handling
- **Zod**: Schema validation
- **Lucide React**: Modern icon library

### Backend
- **Next.js API Routes**: Serverless backend functions
- **Prisma**: Modern database ORM
- **SQLite**: Lightweight database for development
- **JWT**: Secure authentication tokens
- **bcryptjs**: Password hashing

### Additional Tools
- **EmailJS**: Email service integration
- **ESLint**: Code linting
- **TypeScript**: Static type checking

## 🏗 Project Structure

```
unihuslte/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/            # API endpoints
│   │   ├── marketplace/    # Marketplace page
│   │   ├── listing/        # Listing pages
│   │   └── profile/        # User profile
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   ├── auth/          # Authentication components
│   │   └── marketplace/   # Marketplace components
│   ├── lib/               # Utility functions
│   │   ├── db.ts          # Database connection
│   │   ├── auth.ts        # Authentication utilities
│   │   ├── email.ts       # Email utilities
│   │   └── universities.ts # University data
│   └── types/             # TypeScript type definitions
├── prisma/                # Database schema and migrations
├── public/                # Static assets
└── docs/                  # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd unihuslte
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"
   
   # JWT Secret
   JWT_SECRET=your-jwt-secret-key-here
   
   # EmailJS Configuration
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
   ```

4. **Initialize the database**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

### User Model
- **id**: Unique identifier
- **email**: User email (unique)
- **password**: Hashed password
- **fullName**: User's full name
- **universityId**: Reference to university
- **isVerified**: Email verification status
- **otpToken**: Temporary OTP for verification

### University Model
- **id**: Unique identifier
- **name**: University name
- **location**: University location

### Listing Model
- **id**: Unique identifier
- **title**: Listing title
- **description**: Detailed description
- **price**: Item/service price
- **category**: Item category
- **tags**: Searchable tags
- **imageUrl**: Optional image URL
- **isActive**: Listing status
- **userId**: Reference to seller

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/verify-otp` - Email verification
- `GET /api/auth/me` - Get current user

### Listings
- `GET /api/listings` - Get listings with filters
- `POST /api/listings` - Create new listing
- `GET /api/listings/[id]` - Get single listing
- `PUT /api/listings/[id]` - Update listing
- `DELETE /api/listings/[id]` - Delete listing

### Users
- `GET /api/users/[id]/listings` - Get user's listings

### Universities
- `GET /api/universities` - Get all universities

## 🎯 Usage Guide

### For Students (Buyers)
1. **Sign Up**: Create account with university email
2. **Verify Email**: Enter OTP sent to your email
3. **Browse**: Explore listings by category or search
4. **Filter**: Use filters to find specific items
5. **Contact**: Use email or WhatsApp to contact sellers

### For Students (Sellers)
1. **Create Listing**: Add item details, photos, pricing
2. **Manage Listings**: Edit, activate/deactivate listings
3. **Respond**: Reply to buyer inquiries
4. **Track Performance**: View listing statistics

### Sample Login Credentials
For testing purposes, use these sample accounts:
- **Email**: `adebayo@unilag.edu.ng` | **Password**: `password123`
- **Email**: `kemi@ui.edu.ng` | **Password**: `password123`
- **Email**: `chuka@abu.edu.ng` | **Password**: `password123`

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"
JWT_SECRET="your-production-jwt-secret"
```

### Deployment Platforms
- **Vercel**: Recommended for Next.js applications
- **Netlify**: Alternative deployment platform
- **Railway**: For full-stack applications with database

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Nigerian Universities**: For inspiring this project
- **Students**: The target users who make this platform meaningful
- **Open Source Community**: For the amazing tools and libraries

## 📞 Support

For support, email support@unihuslte.com or join our community discussions.

## 🔮 Future Enhancements

- [ ] Real-time messaging system
- [ ] Payment integration (Paystack/Flutterwave)
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Reputation system for users
- [ ] Location-based recommendations
- [ ] Multi-language support
- [ ] Push notifications

---

<div align="center">
  <p>Built with ❤️ for Nigerian students</p>
  <p><strong>UniHuslte - Where Students Connect, Buy, and Sell</strong></p>
</div>
