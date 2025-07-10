// Listings API route for UniHuslte marketplace
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { cookies } from 'next/headers'

// GET /api/listings - Fetch listings with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const university = searchParams.get('university')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    // Build where clause
    const whereClause: any = {
      isActive: true
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category) {
      whereClause.category = category
    }

    if (university) {
      whereClause.user = {
        university: {
          name: university
        }
      }
    }

    if (minPrice || maxPrice) {
      whereClause.price = {}
      if (minPrice) whereClause.price.gte = parseFloat(minPrice)
      if (maxPrice) whereClause.price.lte = parseFloat(maxPrice)
    }

    // Fetch listings
    const [listings, totalCount] = await Promise.all([
      db.listing.findMany({
        where: whereClause,
        include: {
          user: {
            include: {
              university: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      db.listing.count({ where: whereClause })
    ])

    return NextResponse.json({
      listings,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Get listings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/listings - Create new listing
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = await getCurrentUser(token)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { title, description, price, category, tags, imageUrl } = await request.json()

    // Validate input
    if (!title || !description || !price || !category) {
      return NextResponse.json(
        { error: 'Title, description, price, and category are required' },
        { status: 400 }
      )
    }

    if (price <= 0) {
      return NextResponse.json(
        { error: 'Price must be greater than 0' },
        { status: 400 }
      )
    }

    // Create listing
    const listing = await db.listing.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        category,
        tags: tags || null,
        imageUrl: imageUrl || null,
        userId: user.id
      },
      include: {
        user: {
          include: {
            university: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Listing created successfully',
      listing
    })

  } catch (error) {
    console.error('Create listing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}