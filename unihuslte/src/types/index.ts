// TypeScript types for UniHuslte marketplace

export interface User {
  id: string
  email: string
  fullName: string
  universityId: string
  university?: University
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface University {
  id: string
  name: string
  location?: string
  createdAt: Date
}

export interface Listing {
  id: string
  title: string
  description: string
  price: number
  category: string
  tags?: string
  imageUrl?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  userId: string
  user?: User
}

export interface LoginData {
  email: string
  password: string
}

export interface SignupData {
  fullName: string
  email: string
  university: string
  password: string
  confirmPassword: string
}

export interface ListingFormData {
  title: string
  description: string
  price: number
  category: string
  tags?: string
  imageUrl?: string
}

export interface FilterOptions {
  category?: string
  minPrice?: number
  maxPrice?: number
  university?: string
  search?: string
}

export const CATEGORIES = [
  'Electronics',
  'Books & Stationery',
  'Clothing & Fashion',
  'Services',
  'Food & Drinks',
  'Accommodation',
  'Transportation',
  'Other'
] as const

export type Category = typeof CATEGORIES[number]