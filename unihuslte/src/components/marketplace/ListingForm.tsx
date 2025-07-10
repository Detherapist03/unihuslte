// Listing form component for UniHuslte
'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, X } from 'lucide-react'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { ListingFormData, CATEGORIES } from '@/types'

const listingSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Price must be a positive number'
  }),
  category: z.string().min(1, 'Please select a category'),
  tags: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal(''))
})

interface ListingFormProps {
  initialData?: Partial<ListingFormData>
  onSubmit: (data: ListingFormData) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
  submitLabel?: string
}

export default function ListingForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = 'Create Listing'
}: ListingFormProps) {
  const [imagePreview, setImagePreview] = useState<string>(initialData?.imageUrl || '')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<any>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      price: initialData?.price?.toString() || '',
      category: initialData?.category || '',
      tags: initialData?.tags || '',
      imageUrl: initialData?.imageUrl || ''
    }
  })

  const watchedImageUrl = watch('imageUrl')

  const handleImageUrlChange = (url: string) => {
    setValue('imageUrl', url)
    setImagePreview(url)
  }

  const clearImage = () => {
    setValue('imageUrl', '')
    setImagePreview('')
  }

  const handleFormSubmit = async (data: any) => {
    const formData: ListingFormData = {
      ...data,
      price: parseFloat(data.price)
    }
    await onSubmit(formData)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {initialData ? 'Edit Listing' : 'Create New Listing'}
          </h2>
          <p className="text-gray-600 mt-2">
            Fill in the details to list your item or service
          </p>
        </div>

        {/* Title */}
        <Input
          label="Title"
          placeholder="e.g., iPhone 13 Pro Max - Excellent Condition"
          {...register('title')}
          error={errors.title?.message as string}
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            rows={4}
            placeholder="Describe your item or service in detail..."
            className={`
              w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${errors.description 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300'
              }
            `}
            {...register('description')}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message as string}</p>
          )}
        </div>

        {/* Price and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Price (₦)"
            type="number"
            placeholder="0"
            min="0"
            step="0.01"
            {...register('price')}
            error={errors.price?.message as string}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              className={`
                w-full px-3 py-2 border rounded-lg text-gray-900 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.category 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300'
                }
              `}
              {...register('category')}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message as string}</p>
            )}
          </div>
        </div>

        {/* Tags */}
        <Input
          label="Tags (optional)"
          placeholder="e.g., electronics, smartphone, apple"
          helperText="Separate multiple tags with commas"
          {...register('tags')}
          error={errors.tags?.message as string}
        />

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image (optional)
          </label>
          <div className="space-y-4">
            <Input
              placeholder="Enter image URL (e.g., from Google Drive, Dropbox, etc.)"
              value={watchedImageUrl}
              onChange={(e) => handleImageUrlChange(e.target.value)}
              error={errors.imageUrl?.message as string}
            />
            
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Upload className="text-blue-600 mt-0.5" size={20} />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Image Upload Tips</h4>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• Upload your image to Google Drive, Dropbox, or any image hosting service</li>
                    <li>• Get the public/shareable link and paste it above</li>
                    <li>• For Google Drive: Right-click → Get link → Change to "Anyone with the link"</li>
                    <li>• Make sure the link directly shows the image (ends with .jpg, .png, etc.)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="flex-1"
          >
            {submitLabel}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}