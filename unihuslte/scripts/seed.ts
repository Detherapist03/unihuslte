import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  await prisma.listing.deleteMany()
  await prisma.user.deleteMany()
  await prisma.university.deleteMany()

  // Create universities
  const universities = [
    { name: 'University of Lagos (UNILAG)', state: 'Lagos', country: 'Nigeria' },
    { name: 'University of Ibadan (UI)', state: 'Oyo', country: 'Nigeria' },
    { name: 'Obafemi Awolowo University (OAU)', state: 'Osun', country: 'Nigeria' },
    { name: 'University of Nigeria, Nsukka (UNN)', state: 'Enugu', country: 'Nigeria' },
    { name: 'Ahmadu Bello University (ABU)', state: 'Kaduna', country: 'Nigeria' },
    { name: 'Covenant University', state: 'Ogun', country: 'Nigeria' },
  ]

  console.log('📚 Creating universities...')
  const createdUniversities = await Promise.all(
    universities.map(uni => 
      prisma.university.create({ data: uni })
    )
  )

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const users = [
    {
      name: 'John Adebayo',
      email: 'john.adebayo@unilag.edu.ng',
      university: 'University of Lagos (UNILAG)',
      universityId: createdUniversities[0].id,
      password: hashedPassword,
      isVerified: true,
    },
    {
      name: 'Sarah Okafor',
      email: 'sarah.okafor@ui.edu.ng',
      university: 'University of Ibadan (UI)',
      universityId: createdUniversities[1].id,
      password: hashedPassword,
      isVerified: true,
    },
    {
      name: 'David Chukwu',
      email: 'david.chukwu@oauife.edu.ng',
      university: 'Obafemi Awolowo University (OAU)',
      universityId: createdUniversities[2].id,
      password: hashedPassword,
      isVerified: true,
    },
    {
      name: 'Grace Eze',
      email: 'grace.eze@unn.edu.ng',
      university: 'University of Nigeria, Nsukka (UNN)',
      universityId: createdUniversities[3].id,
      password: hashedPassword,
      isVerified: true,
    },
    {
      name: 'Ahmed Hassan',
      email: 'ahmed.hassan@abu.edu.ng',
      university: 'Ahmadu Bello University (ABU)',
      universityId: createdUniversities[4].id,
      password: hashedPassword,
      isVerified: true,
    },
  ]

  console.log('👥 Creating users...')
  const createdUsers = await Promise.all(
    users.map(user => 
      prisma.user.create({ data: user })
    )
  )

  // Create sample listings
  const listings = [
    {
      title: 'iPhone 13 Pro Max - Excellent Condition',
      description: 'Barely used iPhone 13 Pro Max, 256GB, Space Grey. Comes with original box, charger, and screen protector already applied. No scratches or dents. Selling because I got a new phone from work.',
      price: 450000,
      category: 'electronics',
      tags: JSON.stringify(['apple', 'iphone', 'smartphone', 'barely used', 'original box']),
      imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
      contact: '+2348012345678',
      campus: 'University of Lagos (UNILAG)',
      userId: createdUsers[0].id,
    },
    {
      title: 'Engineering Mathematics Textbook - 4th Edition',
      description: 'Engineering Mathematics by K.A. Stroud, 4th Edition. Perfect for engineering students. Well-maintained with minimal highlighting. All pages intact.',
      price: 8500,
      category: 'books',
      tags: JSON.stringify(['textbook', 'engineering', 'mathematics', 'stroud', 'good condition']),
      contact: 'sarah.okafor@ui.edu.ng',
      campus: 'University of Ibadan (UI)',
      userId: createdUsers[1].id,
    },
    {
      title: 'Gaming Laptop - ASUS ROG Strix',
      description: 'ASUS ROG Strix G15, AMD Ryzen 7, 16GB RAM, RTX 3060, 512GB SSD. Perfect for gaming and heavy software development. Used for 1 year, excellent performance.',
      price: 380000,
      category: 'electronics',
      tags: JSON.stringify(['gaming', 'laptop', 'asus', 'rog', 'ryzen', 'rtx']),
      imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500',
      contact: '+2348098765432',
      campus: 'Obafemi Awolowo University (OAU)',
      userId: createdUsers[2].id,
    },
    {
      title: 'Female Hostel Space Available',
      description: 'Clean and secure hostel accommodation available for female students. Includes bed, wardrobe, reading table, and chair. Shared kitchen and bathroom facilities. Close to campus.',
      price: 45000,
      category: 'accommodation',
      tags: JSON.stringify(['hostel', 'female', 'accommodation', 'secure', 'furnished']),
      contact: 'grace.eze@unn.edu.ng',
      campus: 'University of Nigeria, Nsukka (UNN)',
      userId: createdUsers[3].id,
    },
    {
      title: 'Nike Air Force 1 - Size 42',
      description: 'Authentic Nike Air Force 1 sneakers, size 42. White colorway, worn a few times only. Perfect for casual wear and sports activities.',
      price: 28000,
      category: 'fashion',
      tags: JSON.stringify(['nike', 'sneakers', 'air force 1', 'white', 'size 42', 'authentic']),
      imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
      contact: '+2348076543210',
      campus: 'Ahmadu Bello University (ABU)',
      userId: createdUsers[4].id,
    },
    {
      title: 'Statistics Textbook Bundle',
      description: 'Complete set of statistics textbooks including Introduction to Statistics, Advanced Statistical Methods, and SPSS Guide. Perfect for statistics students.',
      price: 15000,
      category: 'books',
      tags: JSON.stringify(['statistics', 'textbook', 'bundle', 'spss', 'complete set']),
      contact: 'john.adebayo@unilag.edu.ng',
      campus: 'University of Lagos (UNILAG)',
      userId: createdUsers[0].id,
    },
    {
      title: 'MacBook Air M1 - 2021',
      description: 'MacBook Air with M1 chip, 8GB RAM, 256GB SSD. Excellent battery life and performance. Comes with original charger and carrying case.',
      price: 420000,
      category: 'electronics',
      tags: JSON.stringify(['macbook', 'air', 'm1', 'apple', 'laptop', '2021']),
      imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500',
      contact: '+2348087654321',
      campus: 'University of Ibadan (UI)',
      userId: createdUsers[1].id,
    },
    {
      title: 'Bicycle - Mountain Bike',
      description: 'Mountain bike in good condition. Perfect for campus transportation and weekend adventures. Recently serviced with new tires.',
      price: 35000,
      category: 'transportation',
      tags: JSON.stringify(['bicycle', 'mountain bike', 'transportation', 'good condition', 'serviced']),
      contact: 'david.chukwu@oauife.edu.ng',
      campus: 'Obafemi Awolowo University (OAU)',
      userId: createdUsers[2].id,
    },
    {
      title: 'Organic Chemistry Study Guide',
      description: 'Comprehensive organic chemistry study guide with practice questions and solutions. Very helpful for understanding complex concepts.',
      price: 4500,
      category: 'books',
      tags: JSON.stringify(['organic chemistry', 'study guide', 'practice questions', 'solutions']),
      contact: 'grace.eze@unn.edu.ng',
      campus: 'University of Nigeria, Nsukka (UNN)',
      userId: createdUsers[3].id,
    },
    {
      title: 'Tutoring Services - Mathematics & Physics',
      description: 'Experienced tutor offering personalized tutoring in Mathematics and Physics for undergraduate students. Flexible timing and competitive rates.',
      price: 3000,
      category: 'services',
      tags: JSON.stringify(['tutoring', 'mathematics', 'physics', 'undergraduate', 'experienced']),
      contact: '+2348090123456',
      campus: 'Ahmadu Bello University (ABU)',
      userId: createdUsers[4].id,
    },
  ]

  console.log('📦 Creating listings...')
  await Promise.all(
    listings.map(listing => 
      prisma.listing.create({ data: listing })
    )
  )

  console.log('✅ Database seeding completed successfully!')
  console.log(`Created:
    - ${universities.length} universities
    - ${users.length} users  
    - ${listings.length} listings`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })