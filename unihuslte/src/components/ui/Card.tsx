// Reusable Card component for UniHuslte
import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

export default function Card({
  children,
  className = '',
  hover = false,
  padding = 'md'
}: CardProps) {
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }
  
  const baseClasses = `
    bg-white rounded-lg border border-gray-200 shadow-sm
    ${hover ? 'hover:shadow-md transition-shadow cursor-pointer' : ''}
    ${paddingClasses[padding]}
    ${className}
  `
  
  return (
    <div className={baseClasses}>
      {children}
    </div>
  )
}