// Home page for UniHuslte
'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ShoppingBag, 
  BookOpen, 
  Smartphone, 
  Car, 
  Home as HomeIcon,
  Utensils,
  Wrench,
  Star,
  TrendingUp,
  Users,
  Shield
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import LoginForm from '@/components/auth/LoginForm'
import SignupForm from '@/components/auth/SignupForm'
import OTPVerification from '@/components/auth/OTPVerification'
import { LoginData, SignupData } from '@/types'

// Category icons mapping
const categoryIcons = {
  'Electronics': Smartphone,
  'Books & Stationery': BookOpen,
  'Clothing & Fashion': ShoppingBag,
  'Services': Wrench,
  'Food & Drinks': Utensils,
  'Accommodation': HomeIcon,
  'Transportation': Car,
  'Other': Star
}

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'otp'>('login')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [signupEmail, setSignupEmail] = useState('')

  // Check authentication status on load
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    }
  }

  const handleLogin = async (data: LoginData) => {
    setAuthLoading(true)
    setAuthError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (response.ok) {
        setUser(result.user)
        setIsAuthModalOpen(false)
        setAuthMode('login')
      } else {
        setAuthError(result.error || 'Login failed')
      }
    } catch (error) {
      setAuthError('Network error. Please try again.')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSignup = async (data: SignupData) => {
    setAuthLoading(true)
    setAuthError('')

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (response.ok) {
        setSignupEmail(data.email)
        setAuthMode('otp')
        setAuthError('')
      } else {
        setAuthError(result.error || 'Signup failed')
      }
    } catch (error) {
      setAuthError('Network error. Please try again.')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleOTPVerify = async (otp: string) => {
    setAuthLoading(true)
    setAuthError('')

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupEmail, otp })
      })

      const result = await response.json()

      if (response.ok) {
        setUser(result.user)
        setIsAuthModalOpen(false)
        setAuthMode('login')
      } else {
        setAuthError(result.error || 'OTP verification failed')
      }
    } catch (error) {
      setAuthError('Network error. Please try again.')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleOTPResend = async () => {
    // In a real implementation, you'd call an API to resend OTP
    console.log('Resending OTP to:', signupEmail)
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode)
    setAuthError('')
    setIsAuthModalOpen(true)
  }

  const featuredCategories = Object.entries(categoryIcons).slice(0, 6)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        user={user} 
        onLogin={() => openAuthModal('login')} 
        onLogout={handleLogout} 
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Student-Powered Marketplace
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Buy, sell, and discover amazing deals with fellow students across Nigerian universities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/marketplace">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  <ShoppingBag size={20} className="mr-2" />
                  Explore Marketplace
                </Button>
              </Link>
              {user ? (
                <Link href="/listing/new">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                    Start Selling
                  </Button>
                </Link>
              ) : (
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => openAuthModal('signup')}
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  Start Hustling Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find exactly what you&apos;re looking for in our organized categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {featuredCategories.map(([category, Icon]) => (
              <Link 
                key={category} 
                href={`/marketplace?category=${encodeURIComponent(category)}`}
                className="group"
              >
                <Card hover className="text-center p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <Icon size={32} className="text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{category}</h3>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose UniHuslte?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Built by students, for students. We understand your unique needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Campus Community</h3>
              <p className="text-gray-600">
                Connect with students from your university and across Nigeria. Build trust within your academic community.
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Safe & Secure</h3>
              <p className="text-gray-600">
                Email verification and university-based communities ensure you&apos;re dealing with real students.
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={32} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Best Deals</h3>
              <p className="text-gray-600">
                Student-friendly prices on everything from textbooks to electronics. Save money, earn money.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Hustle?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of students already buying and selling on UniHuslte
          </p>
          {!user ? (
            <Button 
              size="lg" 
              variant="primary"
              onClick={() => openAuthModal('signup')}
            >
              Join UniHuslte Today
            </Button>
          ) : (
            <Link href="/marketplace">
              <Button size="lg" variant="primary">
                Explore Marketplace
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Authentication Modal */}
      <Modal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        size="md"
      >
        {authMode === 'login' && (
          <LoginForm
            onSubmit={handleLogin}
            isLoading={authLoading}
            error={authError}
          />
        )}
        {authMode === 'signup' && (
          <SignupForm
            onSubmit={handleSignup}
            isLoading={authLoading}
            error={authError}
          />
        )}
        {authMode === 'otp' && (
          <OTPVerification
            email={signupEmail}
            onVerify={handleOTPVerify}
            onResend={handleOTPResend}
            isLoading={authLoading}
            error={authError}
          />
        )}
        
        {/* Auth Mode Toggle */}
        {authMode !== 'otp' && (
          <div className="text-center mt-4">
            {authMode === 'login' ? (
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setAuthMode('signup')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign up here
                </button>
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => setAuthMode('login')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        )}
      </Modal>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <span className="text-xl font-bold">UniHuslte</span>
            </div>
            <p className="text-gray-400 mb-4">The Student Marketplace for Nigeria</p>
            <p className="text-sm text-gray-500">
              © 2024 UniHuslte. Built with ❤️ for Nigerian students.
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile bottom padding for fixed nav */}
      {user && <div className="md:hidden h-20"></div>}
    </div>
  )
}
