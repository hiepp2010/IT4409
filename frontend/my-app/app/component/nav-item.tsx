'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from 'lucide-react'

interface NavItemProps {
  children: React.ReactNode
  dropdownContent?: React.ReactNode
}

export default function NavItem({ children, dropdownContent }: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  let hoverTimeout: NodeJS.Timeout

  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    hoverTimeout = setTimeout(() => setIsOpen(false), 200)
  }

  return (
    <li 
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Button 
        variant="ghost" 
        className="text-gray-700 group-hover:text-blue-600 transition-colors duration-200"
      >
        {children}
        {dropdownContent && (
          <ChevronDown className="ml-1 h-4 w-4" />
        )}
      </Button>
      <AnimatePresence>
        {isOpen && dropdownContent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-2 space-y-1"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {dropdownContent}
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

