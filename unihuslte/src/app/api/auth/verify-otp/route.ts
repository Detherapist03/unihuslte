// OTP verification API route for UniHuslte
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    // Find user with matching email and OTP
    const user = await db.user.findFirst({
      where: {
        email,
        otpToken: otp,
        otpExpiry: {
          gt: new Date()
        }
      },
      include: {
        university: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      )
    }

    // Update user as verified and clear OTP
    const verifiedUser = await db.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        otpToken: null,
        otpExpiry: null
      },
      include: {
        university: true
      }
    })

    // Generate JWT token
    const token = generateToken({
      userId: verifiedUser.id,
      email: verifiedUser.email
    })

    // Create response with token in httpOnly cookie
    const response = NextResponse.json({
      message: 'Email verified successfully',
      user: {
        id: verifiedUser.id,
        fullName: verifiedUser.fullName,
        email: verifiedUser.email,
        university: verifiedUser.university
      }
    })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response

  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}