import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

// GET - Fetch single listing
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            university: true,
            createdAt: true,
          },
        },
      },
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ listing })

  } catch (error) {
    console.error('Fetch listing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update listing
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      )
    }
    
    const user = await getUserFromToken(token)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Check if listing exists and belongs to user
    const existingListing = await prisma.listing.findUnique({
      where: { id: params.id },
    })

    if (!existingListing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    if (existingListing.userId !== user.id) {
      return NextResponse.json(
        { error: 'You can only update your own listings' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Convert tags array to JSON string if needed
    if (body.tags && Array.isArray(body.tags)) {
      body.tags = JSON.stringify(body.tags)
    }
    
    // Update listing
    const listing = await prisma.listing.update({
      where: { id: params.id },
      data: body,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
    
    return NextResponse.json({
      message: 'Listing updated successfully',
      listing
    })
    
  } catch (error) {
    console.error('Update listing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete listing
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      )
    }
    
    const user = await getUserFromToken(token)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Check if listing exists and belongs to user
    const existingListing = await prisma.listing.findUnique({
      where: { id: params.id },
    })

    if (!existingListing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    if (existingListing.userId !== user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own listings' },
        { status: 403 }
      )
    }
    
    // Delete listing
    await prisma.listing.delete({
      where: { id: params.id },
    })
    
    return NextResponse.json({
      message: 'Listing deleted successfully'
    })
    
  } catch (error) {
    console.error('Delete listing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}