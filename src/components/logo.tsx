'use client'

import React from 'react'

interface LogoProps {
  size?: number
  className?: string
}

export default function Logo({ size = 40, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="#005DAC" stroke="#005DAC" strokeWidth="2"/>
      
      {/* Letter B - Simple and clean */}
      <text 
        x="50" 
        y="65" 
        fontFamily="Arial, sans-serif" 
        fontSize="48" 
        fontWeight="bold" 
        textAnchor="middle" 
        fill="white"
      >
        B
      </text>
    </svg>
  )
}

// Compact version for headers
export function LogoCompact({ size = 32, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="#005DAC" stroke="#005DAC" strokeWidth="2"/>
      
      {/* Letter B - Simple and clean */}
      <text 
        x="50" 
        y="65" 
        fontFamily="Arial, sans-serif" 
        fontSize="48" 
        fontWeight="bold" 
        textAnchor="middle" 
        fill="white"
      >
        B
      </text>
    </svg>
  )
}

// Text logo with icon
export function LogoWithText({ size = 32, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <LogoCompact size={size} />
      <div>
        <h1 className="text-xl font-bold text-gray-900">Balaji Loan</h1>
        <p className="text-xs text-gray-500">Instant Personal Loans</p>
      </div>
    </div>
  )
}
