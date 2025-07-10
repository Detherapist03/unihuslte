'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload, X, Plus, Tag } from 'lucide-react'
import { listingSchema, type ListingData } from '@/lib/validations'

const categories = [
  'Books',
  'Electronics',
  'Transportation',
  'Accommodation',
  'Fashion',
  'Gaming',
  'Services',
  'Furniture',
  'Sports',
  'Other'
]

const campuses = [
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

interface FormInputs {
  title: string
  description: string
  price: number
  category: string
  contact: string
  campus: string
  imageUrl?: string
}

export default function AddListingPage() {
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const router = useRouter()

  const form = useForm<FormInputs>({
    resolver: zodResolver(listingSchema.omit({ tags: true })),
    defaultValues: {
      price: 0
    }
  })

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setIsAuthenticated(false)
      router.push('/login')
      return
    }

    // Verify token
    fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      if (res.ok) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
        localStorage.removeItem('token')
        router.push('/login')
      }
    })
    .catch(() => {
      setIsAuthenticated(false)
      localStorage.removeItem('token')
      router.push('/login')
    })
  }, [router])

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const onSubmit = async (data: FormInputs) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please log in to create a listing')
        router.push('/login')
        return
      }

      const listingData = {
        ...data,
        tags: JSON.stringify(tags),
        price: Number(data.price)
      }

      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(listingData),
      })

      const result = await response.json()

      if (response.ok) {
        alert('Listing created successfully!')
        router.push('/marketplace')
      } else {
        alert(result.error || 'Failed to create listing')
      }
    } catch (error) {
      console.error('Create listing error:', error)
      alert('An error occurred while creating the listing')
    } finally {
      setLoading(false)
    }
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated === false) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Listing
          </h1>
          <p className="text-gray-600">
            Share your products or services with fellow students
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                {...form.register('title')}
                type="text"
                placeholder="e.g., iPhone 13 Pro Max - Excellent Condition"
                className="form-input"
              />
              {form.formState.errors.title && (
                <p className="error-text">{form.formState.errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...form.register('description')}
                placeholder="Provide detailed information about your item or service..."
                className="form-textarea"
                rows={4}
              />
              {form.formState.errors.description && (
                <p className="error-text">{form.formState.errors.description.message}</p>
              )}
            </div>

            {/* Price and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₦) *
                </label>
                <input
                  {...form.register('price', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  className="form-input"
                />
                {form.formState.errors.price && (
                  <p className="error-text">{form.formState.errors.price.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  {...form.register('category')}
                  className="form-select"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category.toLowerCase()}>
                      {category}
                    </option>
                  ))}
                </select>
                {form.formState.errors.category && (
                  <p className="error-text">{form.formState.errors.category.message}</p>
                )}
              </div>
            </div>

            {/* Campus and Contact Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="campus" className="block text-sm font-medium text-gray-700 mb-2">
                  Campus *
                </label>
                <select
                  {...form.register('campus')}
                  className="form-select"
                >
                  <option value="">Select your campus</option>
                  {campuses.map((campus) => (
                    <option key={campus} value={campus}>
                      {campus}
                    </option>
                  ))}
                </select>
                {form.formState.errors.campus && (
                  <p className="error-text">{form.formState.errors.campus.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Information *
                </label>
                <input
                  {...form.register('contact')}
                  type="text"
                  placeholder="WhatsApp number or email"
                  className="form-input"
                />
                {form.formState.errors.contact && (
                  <p className="error-text">{form.formState.errors.contact.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Provide your WhatsApp number (e.g., +2348012345678) or email address
                </p>
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Image URL (Optional)
              </label>
              <input
                {...form.register('imageUrl')}
                type="url"
                placeholder="https://example.com/image.jpg"
                className="form-input"
              />
              {form.formState.errors.imageUrl && (
                <p className="error-text">{form.formState.errors.imageUrl.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Upload your image to a service like Google Drive, Dropbox, or Imgur and paste the public link here
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Optional)
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  className="form-input flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="btn-outline px-3"
                >
                  <Plus size={20} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Add relevant tags to help buyers find your listing (e.g., "brand new", "negotiable", "urgent")
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner mr-2" />
                    Creating Listing...
                  </div>
                ) : (
                  'Create Listing'
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            Tips for a Great Listing
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Use clear, descriptive titles that include the brand and condition
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Provide detailed descriptions including condition, age, and any defects
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Set competitive prices by checking similar listings
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Add high-quality photos to increase buyer interest
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Respond quickly to inquiries to build trust
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}