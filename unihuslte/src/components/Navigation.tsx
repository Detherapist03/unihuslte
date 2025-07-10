'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, User, ShoppingBag, Home, PlusCircle, LogOut } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  isVerified: boolean
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (token) {
      // Fetch user data
      fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) {
          setUser(data.user)
        }
      })
      .catch(() => {
        // If token is invalid, remove it
        localStorage.removeItem('token')
      })
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/')
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-white shadow-lg border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="bg-green-600 text-white p-2 rounded-lg">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-green-600">UniHuslte</h1>
                  <p className="text-xs text-gray-500">Student Marketplace</p>
                </div>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors">
                Home
              </Link>
              <Link href="/marketplace" className="text-gray-700 hover:text-green-600 transition-colors">
                Marketplace
              </Link>
              {user && (
                <Link href="/add-listing" className="text-gray-700 hover:text-green-600 transition-colors">
                  Add Listing
                </Link>
              )}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link href="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-green-600">
                    <User size={20} />
                    <span>{user.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-700 hover:text-red-600"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/login" className="text-gray-700 hover:text-green-600">
                    Login
                  </Link>
                  <Link href="/signup" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white shadow-lg border-b border-green-100">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="bg-green-600 text-white p-2 rounded-lg">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-green-600">UniHuslte</h1>
                </div>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-green-600"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isOpen && (
            <div className="pb-3 space-y-1">
              <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-green-600">
                Home
              </Link>
              <Link href="/marketplace" className="block px-3 py-2 text-gray-700 hover:text-green-600">
                Marketplace
              </Link>
              {user && (
                <Link href="/add-listing" className="block px-3 py-2 text-gray-700 hover:text-green-600">
                  Add Listing
                </Link>
              )}
              {user ? (
                <>
                  <Link href="/profile" className="block px-3 py-2 text-gray-700 hover:text-green-600">
                    Profile ({user.name})
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block px-3 py-2 text-gray-700 hover:text-green-600">
                    Login
                  </Link>
                  <Link href="/signup" className="block px-3 py-2 text-gray-700 hover:text-green-600">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      {user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-green-100 z-50">
          <div className="flex justify-around py-2">
            <Link href="/" className="flex flex-col items-center p-2 text-gray-600 hover:text-green-600">
              <Home size={20} />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link href="/marketplace" className="flex flex-col items-center p-2 text-gray-600 hover:text-green-600">
              <ShoppingBag size={20} />
              <span className="text-xs mt-1">Market</span>
            </Link>
            <Link href="/add-listing" className="flex flex-col items-center p-2 text-gray-600 hover:text-green-600">
              <PlusCircle size={20} />
              <span className="text-xs mt-1">Add</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center p-2 text-gray-600 hover:text-green-600">
              <User size={20} />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}