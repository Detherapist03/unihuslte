// Signup API route for UniHuslte
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, generateOTP } from '@/lib/auth'
import { mockSendOTP } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, university, password } = await request.json()

    // Validate input
    if (!fullName || !email || !university || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Find or create university
    let universityRecord = await db.university.findFirst({
      where: { name: university }
    })

    if (!universityRecord) {
      universityRecord = await db.university.create({
        data: {
          name: university,
          location: 'Nigeria'
        }
      })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Generate OTP
    const otpToken = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Create user
    const user = await db.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        universityId: universityRecord.id,
        otpToken,
        otpExpiry,
        isVerified: false
      },
      include: {
        university: true
      }
    })

    // Send OTP email (using mock for demo)
    const emailSent = mockSendOTP(email, fullName, otpToken)

    if (!emailSent) {
      console.warn('Failed to send OTP email')
    }

    return NextResponse.json({
      message: 'Account created successfully. Please verify your email.',
      userId: user.id,
      email: user.email
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}