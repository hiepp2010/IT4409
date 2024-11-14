'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface NavItemProps {
  children: React.ReactNode
  dropdownContent?: React.ReactNode
}

export default function NavItem({ children, dropdownContent }: NavItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <li 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Button variant="ghost">{children}</Button>
      <AnimatePresence>
        {isHovered && dropdownContent && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-2 space-y-1"
          >
            {dropdownContent}
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}