// Database seed script for UniHuslte
import { db } from './db'
import { NIGERIAN_UNIVERSITIES } from './universities'

export async function seedDatabase() {
  try {
    console.log('Starting database seed...')

    // Seed universities
    console.log('Seeding universities...')
    for (const universityName of NIGERIAN_UNIVERSITIES) {
      await db.university.upsert({
        where: { name: universityName },
        update: {},
        create: {
          name: universityName,
          location: 'Nigeria'
        }
      })
    }

    console.log(`✅ Seeded ${NIGERIAN_UNIVERSITIES.length} universities`)

    // Get some universities for sample users
    const universities = await db.university.findMany({ take: 5 })

    // Create sample users (only if no users exist)
    const existingUsers = await db.user.count()
    if (existingUsers === 0) {
      console.log('Creating sample users...')
      
      const sampleUsers = [
        {
          fullName: 'Adebayo Ogundimu',
          email: 'adebayo@unilag.edu.ng',
          password: '$2a$12$LQv3c1yqBwEHFoq2.0ZGduJ8V8FXNj6qDlJxJmI8eMH5dX7YxZm2O', // password123
          universityId: universities[0].id,
          isVerified: true
        },
        {
          fullName: 'Kemi Adebisi',
          email: 'kemi@ui.edu.ng',
          password: '$2a$12$LQv3c1yqBwEHFoq2.0ZGduJ8V8FXNj6qDlJxJmI8eMH5dX7YxZm2O', // password123
          universityId: universities[1].id,
          isVerified: true
        },
        {
          fullName: 'Chuka Okafor',
          email: 'chuka@abu.edu.ng',
          password: '$2a$12$LQv3c1yqBwEHFoq2.0ZGduJ8V8FXNj6qDlJxJmI8eMH5dX7YxZm2O', // password123
          universityId: universities[2].id,
          isVerified: true
        }
      ]

      for (const userData of sampleUsers) {
        await db.user.create({ data: userData })
      }

      console.log(`✅ Created ${sampleUsers.length} sample users`)

      // Create sample listings
      console.log('Creating sample listings...')
      const users = await db.user.findMany({ take: 3 })

      const sampleListings = [
        {
          title: 'iPhone 13 Pro Max - Excellent Condition',
          description: 'Barely used iPhone 13 Pro Max, 256GB, Space Gray. Comes with original box, charger, and screen protector already applied. Battery health at 98%. Perfect for a student who needs a reliable phone.',
          price: 450000,
          category: 'Electronics',
          tags: 'iphone, smartphone, apple, electronics',
          userId: users[0].id,
          isActive: true
        },
        {
          title: 'Engineering Mathematics Textbook',
          description: 'K.A. Stroud Engineering Mathematics 7th Edition. Used for one semester only, in excellent condition. All pages intact, no highlighting or writing. Perfect for engineering students.',
          price: 8500,
          category: 'Books & Stationery',
          tags: 'textbook, mathematics, engineering, stroud',
          userId: users[1].id,
          isActive: true
        },
        {
          title: 'MacBook Air M1 - Student Price',
          description: 'MacBook Air with M1 chip, 8GB RAM, 256GB SSD. Used for programming and design work. Excellent performance, great battery life. Selling because I\'m upgrading.',
          price: 520000,
          category: 'Electronics',
          tags: 'macbook, laptop, apple, programming, design',
          userId: users[0].id,
          isActive: true
        },
        {
          title: 'Hostel Accommodation Near Campus',
          description: 'Single room in a safe hostel, 5 minutes walk to main campus. Includes bed, wardrobe, reading table, and chair. Shared kitchen and bathroom. Very secure area.',
          price: 45000,
          category: 'Accommodation',
          tags: 'hostel, accommodation, room, campus',
          userId: users[2].id,
          isActive: true
        },
        {
          title: 'Tutorial Services - Mathematics & Physics',
          description: 'Offering tutorial services for undergraduate Mathematics and Physics. 5 years experience, excellent track record. Available for one-on-one or group sessions.',
          price: 3000,
          category: 'Services',
          tags: 'tutorial, mathematics, physics, teaching',
          userId: users[1].id,
          isActive: true
        },
        {
          title: 'Designer Sneakers - Nike Air Force 1',
          description: 'White Nike Air Force 1, size 42, worn only a few times. Perfect for casual wear or sports. Authentic Nike product with box and receipt.',
          price: 35000,
          category: 'Clothing & Fashion',
          tags: 'nike, sneakers, shoes, fashion, airforce1',
          userId: users[2].id,
          isActive: true
        }
      ]

      for (const listingData of sampleListings) {
        await db.listing.create({ data: listingData })
      }

      console.log(`✅ Created ${sampleListings.length} sample listings`)
    }

    console.log('✅ Database seeding completed successfully!')

  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    throw error
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seed completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Seed failed:', error)
      process.exit(1)
    })
}