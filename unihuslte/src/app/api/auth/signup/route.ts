import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateOTP } from '@/lib/auth'
import { signUpSchema } from '@/lib/validations'
import { sendOTPEmail, logOTPForDevelopment } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = signUpSchema.parse(body)
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }
    
    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)
    
    // Generate OTP
    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    
    // Create user with OTP
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        university: validatedData.university,
        password: hashedPassword,
        otpToken: otp,
        otpExpiry,
        isVerified: false,
      },
    })
    
    // Send OTP email
    try {
      await sendOTPEmail(validatedData.email, otp, validatedData.name)
    } catch (error) {
      console.error('Email sending failed:', error)
      // Log OTP for development
      logOTPForDevelopment(validatedData.email, otp)
    }
    
    return NextResponse.json({
      message: 'User created successfully. Please check your email for OTP verification.',
      email: validatedData.email
    })
    
  } catch (error: any) {
    console.error('Signup error:', error)
    
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