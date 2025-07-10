// New listing page for UniHuslte
'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import ListingForm from '@/components/marketplace/ListingForm'
import { ListingFormData } from '@/types'

export default function NewListingPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        // Redirect to home page if not authenticated
        router.push('/')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateListing = async (data: ListingFormData) => {
    setSubmitLoading(true)
    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        const result = await response.json()
        router.push(`/listing/${result.listing.id}`)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create listing')
      }
    } catch (error) {
      console.error('Create listing error:', error)
      alert('Network error. Please try again.')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        user={user} 
        onLogin={() => {}} 
        onLogout={handleLogout} 
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Listing</h1>
          <p className="text-gray-600">
            List your item or service to reach thousands of students
          </p>
        </div>

        <ListingForm
          onSubmit={handleCreateListing}
          onCancel={handleCancel}
          isLoading={submitLoading}
          submitLabel="Create Listing"
        />
      </div>

      {/* Mobile bottom padding */}
      <div className="md:hidden h-20"></div>
    </div>
  )
}