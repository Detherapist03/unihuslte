import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken } from '@/lib/auth'
import { otpSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = otpSchema.parse(body)
    
    // Find user with this email and OTP
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Check if OTP is valid and not expired
    if (user.otpToken !== validatedData.otp) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      )
    }
    
    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      return NextResponse.json(
        { error: 'OTP has expired' },
        { status: 400 }
      )
    }
    
    // Verify the user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        otpToken: null,
        otpExpiry: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        university: true,
        isVerified: true,
        createdAt: true,
      },
    })
    
    // Generate JWT token
    const token = generateToken(user.id)
    
    return NextResponse.json({
      message: 'Email verified successfully',
      token,
      user: updatedUser
    })
    
  } catch (error: any) {
    console.error('OTP verification error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}