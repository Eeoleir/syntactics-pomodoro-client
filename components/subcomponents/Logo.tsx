import React from 'react'
import Image from 'next/image'

import localLogo from '@/public/logo.png'; // Adjust path as needed

const Logo = () => {
  return (
    <div className="logo flex items-center gap-2">
      <Image
        src={localLogo}
        alt="PomoSync Logo"
        width={48}
        height={48}
        className="h-6 w-6 sm:h-8 sm:w-8"
      />
      <h1 className="text-lg sm:text-xl font-bold">PomoSync</h1>
    </div>
  )
}
export default Logo