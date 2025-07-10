// User listings API route for UniHuslte
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { cookies } from 'next/headers'

// GET /api/users/[id]/listings - Get user's listings
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    // Check if requesting user's own listings
    let isOwnListings = false
    if (token) {
      const currentUser = await getCurrentUser(token)
      isOwnListings = currentUser?.id === id
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    // Build where clause
    const whereClause: any = {
      userId: id
    }

    // Only show active listings for others, show all for owner
    if (!isOwnListings) {
      whereClause.isActive = true
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
    console.error('Get user listings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}