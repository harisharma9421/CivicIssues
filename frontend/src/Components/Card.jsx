import React from 'react'

const Card = ({ 
  children, 
  variant = 'default',
  className = '',
  hover = true,
  ...props 
}) => {
  const variants = {
    default: "bg-white border border-gray-200 shadow-sm",
    elevated: "bg-white border border-gray-300 shadow-md",
    glass: "bg-white/95 backdrop-blur-sm border border-gray-200 shadow-sm",
    gradient: "bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm"
  }

  const hoverClasses = hover
    ? "transition-all duration-200 hover:shadow-md hover:border-gray-300"
    : ""

  return (
    <div
      className={`rounded-lg p-6 ${variants[variant]} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
