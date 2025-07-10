// Main navigation component for UniHuslte
'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, User, Search, Plus, Home, ShoppingBag } from 'lucide-react'
import Button from './ui/Button'

interface NavigationProps {
  user?: {
    id: string
    fullName: string
    email: string
  } | null
  onLogin: () => void
  onLogout: () => void
}

export default function Navigation({ user, onLogin, onLogout }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">U</span>
                </div>
                <span className="text-xl font-bold text-gray-900">UniHuslte</span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className={`text-sm font-medium ${
                  isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Home
              </Link>
              <Link
                href="/marketplace"
                className={`text-sm font-medium ${
                  isActive('/marketplace') ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Marketplace
              </Link>
              {user && (
                <Link
                  href="/listing/new"
                  className={`text-sm font-medium ${
                    isActive('/listing/new') ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Sell
                </Link>
              )}
            </div>

            {/* Auth Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link href="/profile">
                    <Button variant="ghost" size="sm">
                      <User size={16} className="mr-2" />
                      {user.fullName.split(' ')[0]}
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={onLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <Button variant="primary" size="sm" onClick={onLogin}>
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-gray-900"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                href="/"
                className={`block px-3 py-2 text-base font-medium rounded-md ${
                  isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/marketplace"
                className={`block px-3 py-2 text-base font-medium rounded-md ${
                  isActive('/marketplace') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Marketplace
              </Link>
              {user && (
                <Link
                  href="/listing/new"
                  className={`block px-3 py-2 text-base font-medium rounded-md ${
                    isActive('/listing/new') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sell Item
                </Link>
              )}
              {user && (
                <Link
                  href="/profile"
                  className={`block px-3 py-2 text-base font-medium rounded-md ${
                    isActive('/profile') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
              )}
              
              <div className="border-t pt-4">
                {user ? (
                  <div className="px-3">
                    <p className="text-sm text-gray-600 mb-2">Signed in as {user.fullName}</p>
                    <Button variant="outline" size="sm" onClick={onLogout} className="w-full">
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="px-3">
                    <Button variant="primary" size="sm" onClick={onLogin} className="w-full">
                      Sign In
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      {user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40">
          <div className="flex justify-around py-2">
            <Link href="/" className={`flex flex-col items-center py-2 px-3 ${isActive('/') ? 'text-blue-600' : 'text-gray-600'}`}>
              <Home size={20} />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link href="/marketplace" className={`flex flex-col items-center py-2 px-3 ${isActive('/marketplace') ? 'text-blue-600' : 'text-gray-600'}`}>
              <ShoppingBag size={20} />
              <span className="text-xs mt-1">Market</span>
            </Link>
            <Link href="/listing/new" className={`flex flex-col items-center py-2 px-3 ${isActive('/listing/new') ? 'text-blue-600' : 'text-gray-600'}`}>
              <Plus size={20} />
              <span className="text-xs mt-1">Sell</span>
            </Link>
            <Link href="/profile" className={`flex flex-col items-center py-2 px-3 ${isActive('/profile') ? 'text-blue-600' : 'text-gray-600'}`}>
              <User size={20} />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}