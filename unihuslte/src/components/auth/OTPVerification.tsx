// OTP verification component for UniHuslte
'use client'
import React, { useState, useEffect } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'

interface OTPVerificationProps {
  email: string
  onVerify: (otp: string) => Promise<void>
  onResend: () => Promise<void>
  isLoading?: boolean
  error?: string
}

export default function OTPVerification({
  email,
  onVerify,
  onResend,
  isLoading = false,
  error
}: OTPVerificationProps) {
  const [otp, setOtp] = useState('')
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length === 6) {
      await onVerify(otp)
    }
  }

  const handleResend = async () => {
    await onResend()
    setCountdown(60)
    setCanResend(false)
    setOtp('')
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
        <p className="text-gray-600 mt-2">
          We&apos;ve sent a 6-digit code to <strong>{email}</strong>
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Enter OTP Code"
          type="text"
          placeholder="000000"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          maxLength={6}
          className="text-center text-2xl tracking-widest"
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          disabled={otp.length !== 6}
          className="w-full"
        >
          Verify Email
        </Button>
      </form>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Didn&apos;t receive the code?{' '}
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Resend OTP
            </button>
          ) : (
            <span className="text-gray-400">
              Resend in {countdown}s
            </span>
          )}
        </p>
      </div>
    </div>
  )
}