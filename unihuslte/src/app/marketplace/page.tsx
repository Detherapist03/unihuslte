// Marketplace page for UniHuslte
'use client'
import React, { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import FilterBar from '@/components/marketplace/FilterBar'
import ListingCard from '@/components/marketplace/ListingCard'
import ContactModal from '@/components/marketplace/ContactModal'
import Button from '@/components/ui/Button'
import { FilterOptions, Listing } from '@/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function MarketplacePage() {
  const [user, setUser] = useState<any>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterOptions>({})
  const [universities, setUniversities] = useState<string[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  })
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [contactModalOpen, setContactModalOpen] = useState(false)

  useEffect(() => {
    checkAuthStatus()
    fetchUniversities()
  }, [])

  useEffect(() => {
    fetchListings()
  }, [filters, pagination.page])

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

  const fetchUniversities = async () => {
    try {
      const response = await fetch('/api/universities')
      if (response.ok) {
        const data = await response.json()
        setUniversities(data.universities.map((u: any) => u.name))
      }
    } catch (error) {
      console.error('Failed to fetch universities:', error)
    }
  }

  const fetchListings = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      if (filters.search) params.append('search', filters.search)
      if (filters.category) params.append('category', filters.category)
      if (filters.university) params.append('university', filters.university)
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString())
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
      params.append('page', pagination.page.toString())

      const response = await fetch(`/api/listings?${params}`)
      if (response.ok) {
        const data = await response.json()
        setListings(data.listings)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleContactSeller = (listing: Listing) => {
    if (!user) {
      alert('Please sign in to contact sellers')
      return
    }
    setSelectedListing(listing)
    setContactModalOpen(true)
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        user={user} 
        onLogin={() => {}} 
        onLogout={handleLogout} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace</h1>
          <p className="text-gray-600">
            Discover amazing deals from students across Nigerian universities
          </p>
        </div>

        {/* Filters */}
        <FilterBar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          universitiesOptions={universities}
        />

        {/* Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-4xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or be the first to list something in this category!
              </p>
              {user && (
                <Button variant="primary" onClick={() => window.location.href = '/listing/new'}>
                  Create First Listing
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onContact={handleContactSeller}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Previous
                </Button>

                <div className="flex items-center space-x-2">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`
                          w-8 h-8 rounded-lg text-sm font-medium
                          ${pagination.page === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                          }
                        `}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                >
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
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
      {user && <div className="md:hidden h-20"></div>}
    </div>
  )
}