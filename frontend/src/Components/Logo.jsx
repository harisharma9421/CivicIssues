import React from 'react'
import logoUrl from '../assets/CivicVoice Logo.png'

const Logo = ({ className = '', size = 'default' }) => {
  const sizes = {
    small: {
      image: "h-10 w-10",
      text: "text-lg"
    },
    default: {
      image: "h-16 w-16",
      text: "text-2xl"
    },
    large: {
      image: "h-20 w-20",
      text: "text-3xl"
    }
  }

  const { image: imageSize, text: textSize } = sizes[size]

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <img 
        src={logoUrl} 
        alt="CivicConnect" 
        className={`${imageSize} rounded-lg object-contain bg-white p-2 border border-gray-200`}
        onError={(e) => {
          console.error('Logo failed to load:', e.target.src)
          e.target.style.display = 'none'
        }}
      />
      <span className={`${textSize} font-bold tracking-tight text-gray-900`}>
        CivicConnect
      </span>
    </div>
  )
}

export default Logo