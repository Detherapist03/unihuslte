// Signup form component for UniHuslte
'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { SignupData } from '@/types'
import { NIGERIAN_UNIVERSITIES } from '@/lib/universities'

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  university: z.string().min(1, 'Please select your university'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

interface SignupFormProps {
  onSubmit: (data: SignupData) => Promise<void>
  isLoading?: boolean
  error?: string
}

export default function SignupForm({ onSubmit, isLoading = false, error }: SignupFormProps) {
  const [showOtherUniversity, setShowOtherUniversity] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema)
  })

  const selectedUniversity = watch('university')

  const handleUniversityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setValue('university', value)
    setShowOtherUniversity(value === 'Other')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Join UniHuslte!</h2>
        <p className="text-gray-600 mt-2">Start your student marketplace journey</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <Input
        label="Full Name"
        type="text"
        placeholder="Enter your full name"
        {...register('fullName')}
        error={errors.fullName?.message}
      />

      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        {...register('email')}
        error={errors.email?.message}
      />

      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          University
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          {...register('university')}
          onChange={handleUniversityChange}
        >
          <option value="">Select your university</option>
          {NIGERIAN_UNIVERSITIES.map((uni) => (
            <option key={uni} value={uni}>
              {uni}
            </option>
          ))}
        </select>
        {errors.university && (
          <p className="mt-1 text-sm text-red-600">{errors.university.message}</p>
        )}
      </div>

      {showOtherUniversity && (
        <Input
          label="University Name"
          type="text"
          placeholder="Enter your university name"
          {...register('university')}
          error={errors.university?.message}
        />
      )}

      <Input
        label="Password"
        type="password"
        placeholder="Create a password"
        {...register('password')}
        error={errors.password?.message}
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        className="w-full"
      >
        Create Account
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <span className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
            Sign in here
          </span>
        </p>
      </div>
    </form>
  )
}