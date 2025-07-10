'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Mail, ArrowLeft } from 'lucide-react'
import { signUpSchema, otpSchema, type SignUpData, type OTPData } from '@/lib/validations'

const nigerianUniversities = [
  'University of Lagos (UNILAG)',
  'University of Ibadan (UI)',
  'Obafemi Awolowo University (OAU)',
  'University of Nigeria, Nsukka (UNN)',
  'Ahmadu Bello University (ABU)',
  'University of Port Harcourt (UNIPORT)',
  'University of Calabar (UNICAL)',
  'Federal University of Technology, Akure (FUTA)',
  'Covenant University',
  'Babcock University',
  'University of Benin (UNIBEN)',
  'Lagos State University (LASU)',
  'Federal University of Technology, Owerri (FUTO)',
  'University of Ilorin (UNILORIN)',
  'Nnamdi Azikiwe University (UNIZIK)',
  'Other',
]

export default function SignupPage() {
  const [step, setStep] = useState<'signup' | 'otp'>('signup')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const signupForm = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
  })

  const otpForm = useForm<OTPData>({
    resolver: zodResolver(otpSchema),
  })

  const onSignupSubmit = async (data: SignUpData) => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        setEmail(data.email)
        setStep('otp')
        alert('Account created! Please check your email for the OTP verification code.')
      } else {
        alert(result.error || 'Signup failed')
      }
    } catch (error) {
      console.error('Signup error:', error)
      alert('An error occurred during signup')
    } finally {
      setLoading(false)
    }
  }

  const onOtpSubmit = async (data: OTPData) => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: data.otp,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        localStorage.setItem('token', result.token)
        alert('Email verified successfully! Welcome to UniHuslte!')
        router.push('/marketplace')
      } else {
        alert(result.error || 'OTP verification failed')
      }
    } catch (error) {
      console.error('OTP verification error:', error)
      alert('An error occurred during verification')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Verify Your Email
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                We've sent a 6-digit code to {email}
              </p>
            </div>

            {/* OTP Form */}
            <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <input
                  {...otpForm.register('otp')}
                  type="text"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="form-input"
                />
                {otpForm.formState.errors.otp && (
                  <p className="error-text">{otpForm.formState.errors.otp.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner mr-2" />
                    Verifying...
                  </div>
                ) : (
                  'Verify Email'
                )}
              </button>
            </form>

            {/* Back to signup */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setStep('signup')}
                className="text-sm text-green-600 hover:text-green-500 flex items-center justify-center mx-auto"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to signup
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-600">
            Join UniHuslte
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Start buying and selling with fellow students
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                {...signupForm.register('name')}
                type="text"
                placeholder="Enter your full name"
                className="form-input"
              />
              {signupForm.formState.errors.name && (
                <p className="error-text">{signupForm.formState.errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                {...signupForm.register('email')}
                type="email"
                placeholder="your.email@university.edu.ng"
                className="form-input"
              />
              {signupForm.formState.errors.email && (
                <p className="error-text">{signupForm.formState.errors.email.message}</p>
              )}
            </div>

            {/* University */}
            <div>
              <label htmlFor="university" className="block text-sm font-medium text-gray-700">
                University
              </label>
              <select
                {...signupForm.register('university')}
                className="form-select"
              >
                <option value="">Select your university</option>
                {nigerianUniversities.map((uni) => (
                  <option key={uni} value={uni}>
                    {uni}
                  </option>
                ))}
              </select>
              {signupForm.formState.errors.university && (
                <p className="error-text">{signupForm.formState.errors.university.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  {...signupForm.register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="form-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {signupForm.formState.errors.password && (
                <p className="error-text">{signupForm.formState.errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  {...signupForm.register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  className="form-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {signupForm.formState.errors.confirmPassword && (
                <p className="error-text">{signupForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner mr-2" />
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-green-600 hover:text-green-500 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}