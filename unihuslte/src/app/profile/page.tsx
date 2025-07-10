'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Calendar, Mail, School, Edit, Trash2, Eye, Plus, Package } from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  email: string
  university: string
  isVerified: boolean
  createdAt: string
}

interface Listing {
  id: string
  title: string
  description: string
  price: number
  category: string
  imageUrl?: string
  status: string
  createdAt: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'active' | 'sold' | 'all'>('active')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetchUserProfile(token)
    fetchUserListings(token)
  }, [router])

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        localStorage.removeItem('token')
        router.push('/login')
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      localStorage.removeItem('token')
      router.push('/login')
    }
  }

  const fetchUserListings = async (token: string, status = 'all') => {
    try {
      const response = await fetch(`/api/users/me/listings?status=${status}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setListings(data.listings)
      }
    } catch (error) {
      console.error('Error fetching user listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/listings/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setListings(listings.filter(listing => listing.id !== listingId))
        alert('Listing deleted successfully!')
      } else {
        alert('Failed to delete listing')
      }
    } catch (error) {
      console.error('Error deleting listing:', error)
      alert('An error occurred while deleting the listing')
    }
  }

  const handleTabChange = (tab: 'active' | 'sold' | 'all') => {
    setActiveTab(tab)
    const token = localStorage.getItem('token')
    if (token) {
      fetchUserListings(token, tab)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const filteredListings = listings.filter(listing => {
    if (activeTab === 'all') return true
    return listing.status === activeTab
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-green-600 text-white p-4 rounded-full mr-4">
                <User size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {user.name}
                </h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <Mail size={16} className="mr-2" />
                  <span>{user.email}</span>
                  {user.isVerified && (
                    <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <School size={16} className="mr-2" />
                  <span>{user.university}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  <span>Member since {formatDate(user.createdAt)}</span>
                </div>
              </div>
            </div>
            <Link
              href="/add-listing"
              className="btn-primary flex items-center"
            >
              <Plus size={20} className="mr-2" />
              Add New Listing
            </Link>
          </div>
        </div>

        {/* Listings Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => handleTabChange('active')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'active'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Active Listings ({listings.filter(l => l.status === 'active').length})
              </button>
              <button
                onClick={() => handleTabChange('sold')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'sold'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Sold Items ({listings.filter(l => l.status === 'sold').length})
              </button>
              <button
                onClick={() => handleTabChange('all')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'all'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                All Listings ({listings.length})
              </button>
            </div>
          </div>

          {/* Listings Content */}
          <div className="p-6">
            {filteredListings.length > 0 ? (
              <div className="space-y-4">
                {filteredListings.map((listing) => (
                  <div key={listing.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Image */}
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                        {listing.imageUrl ? (
                          <img
                            src={listing.imageUrl}
                            alt={listing.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package size={24} />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {listing.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-1">
                          {listing.description}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="font-semibold text-green-600 mr-4">
                            {formatPrice(listing.price)}
                          </span>
                          <span className="capitalize mr-4">
                            {listing.category}
                          </span>
                          <span>
                            {formatDate(listing.createdAt)}
                          </span>
                          <span className={`ml-4 px-2 py-1 rounded-full text-xs font-semibold ${
                            listing.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : listing.status === 'sold'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {listing.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        href={`/listing/${listing.id}`}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye size={18} />
                      </Link>
                      <button
                        onClick={() => router.push(`/edit-listing/${listing.id}`)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => deleteListing(listing.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Package size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {activeTab === 'active' ? 'No active listings' : 
                   activeTab === 'sold' ? 'No sold items' : 'No listings yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === 'active' ? 'Create your first listing to start selling!' :
                   activeTab === 'sold' ? 'You haven\'t sold anything yet.' : 'Start by creating your first listing.'}
                </p>
                <Link href="/add-listing" className="btn-primary inline-flex items-center">
                  <Plus size={20} className="mr-2" />
                  Create Your First Listing
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}