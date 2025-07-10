// Profile page for UniHuslte
'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import ListingCard from '@/components/marketplace/ListingCard'
import ContactModal from '@/components/marketplace/ContactModal'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { User, Edit3, Plus, MoreVertical, Eye, EyeOff } from 'lucide-react'
import { Listing } from '@/types'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [listingsLoading, setListingsLoading] = useState(true)
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  useEffect(() => {
    if (user) {
      fetchUserListings()
    }
  }, [user])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserListings = async () => {
    try {
      const response = await fetch(`/api/users/${user.id}/listings`)
      if (response.ok) {
        const data = await response.json()
        setListings(data.listings)
      }
    } catch (error) {
      console.error('Failed to fetch user listings:', error)
    } finally {
      setListingsLoading(false)
    }
  }

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return

    try {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setListings(listings.filter(listing => listing.id !== listingId))
      } else {
        alert('Failed to delete listing')
      }
    } catch (error) {
      console.error('Delete listing error:', error)
      alert('Network error. Please try again.')
    }
  }

  const handleToggleActive = async (listingId: string, isActive: boolean) => {
    try {
      const listing = listings.find(l => l.id === listingId)
      if (!listing) return

      const response = await fetch(`/api/listings/${listingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...listing,
          isActive: !isActive
        })
      })

      if (response.ok) {
        setListings(listings.map(l => 
          l.id === listingId ? { ...l, isActive: !isActive } : l
        ))
      } else {
        alert('Failed to update listing')
      }
    } catch (error) {
      console.error('Toggle active error:', error)
      alert('Network error. Please try again.')
    }
  }

  const handleContactSeller = (listing: Listing) => {
    setSelectedListing(listing)
    setContactModalOpen(true)
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price)
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const activeListings = listings.filter(l => l.isActive)
  const inactiveListings = listings.filter(l => !l.isActive)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        user={user} 
        onLogin={() => {}} 
        onLogout={handleLogout} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-3xl font-bold">
                {getInitials(user.fullName)}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.fullName}</h1>
              <p className="text-gray-600 mb-1">{user.email}</p>
              <p className="text-gray-600 mb-4">{user.university?.name}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="primary"
                  onClick={() => router.push('/listing/new')}
                >
                  <Plus size={16} className="mr-2" />
                  Create Listing
                </Button>
                <Button
                  variant="outline"
                  onClick={() => alert('Profile editing feature coming soon!')}
                >
                  <Edit3 size={16} className="mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Listings Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">{listings.length}</div>
            <div className="text-gray-600">Total Listings</div>
          </Card>
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">{activeListings.length}</div>
            <div className="text-gray-600">Active Listings</div>
          </Card>
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {formatPrice(activeListings.reduce((sum, listing) => sum + listing.price, 0))}
            </div>
            <div className="text-gray-600">Total Value</div>
          </Card>
        </div>

        {/* My Listings */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Listings</h2>
          
          {listingsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : listings.length === 0 ? (
            <Card className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus size={48} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings yet</h3>
                <p className="text-gray-600 mb-6">
                  Start by creating your first listing to reach thousands of students
                </p>
                <Button
                  variant="primary"
                  onClick={() => router.push('/listing/new')}
                >
                  Create Your First Listing
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Active Listings */}
              {activeListings.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Eye size={20} className="mr-2 text-green-600" />
                    Active Listings ({activeListings.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {activeListings.map((listing) => (
                      <div key={listing.id} className="relative">
                        <ListingCard
                          listing={listing}
                          onContact={handleContactSeller}
                        />
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <button
                            onClick={() => handleToggleActive(listing.id, listing.isActive)}
                            className="bg-yellow-500 text-white p-1 rounded-full hover:bg-yellow-600"
                            title="Mark as inactive"
                          >
                            <EyeOff size={14} />
                          </button>
                          <button
                            onClick={() => router.push(`/listing/${listing.id}/edit`)}
                            className="bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600"
                            title="Edit listing"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteListing(listing.id)}
                            className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                            title="Delete listing"
                          >
                            <MoreVertical size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inactive Listings */}
              {inactiveListings.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <EyeOff size={20} className="mr-2 text-gray-500" />
                    Inactive Listings ({inactiveListings.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {inactiveListings.map((listing) => (
                      <div key={listing.id} className="relative opacity-60">
                        <ListingCard
                          listing={listing}
                          onContact={handleContactSeller}
                        />
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <button
                            onClick={() => handleToggleActive(listing.id, listing.isActive)}
                            className="bg-green-500 text-white p-1 rounded-full hover:bg-green-600"
                            title="Mark as active"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => router.push(`/listing/${listing.id}/edit`)}
                            className="bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600"
                            title="Edit listing"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteListing(listing.id)}
                            className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                            title="Delete listing"
                          >
                            <MoreVertical size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Contact Modal */}
      {selectedListing && (
        <ContactModal
          listing={selectedListing}
          isOpen={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
        />
      )}

      {/* Mobile bottom padding */}
      <div className="md:hidden h-20"></div>
    </div>
  )
}