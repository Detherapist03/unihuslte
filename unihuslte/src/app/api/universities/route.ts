// Universities API route for UniHuslte
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/universities - Get all universities
export async function GET(request: NextRequest) {
  try {
    const universities = await db.university.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({ universities })

  } catch (error) {
    console.error('Get universities error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}