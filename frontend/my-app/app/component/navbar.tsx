'use client'

import Link from 'next/link'
import Image from 'next/image'
import NavItem from "./nav-item"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart, User } from 'lucide-react'
import { useCart } from '../contexts/CartContext'

export default function NavBar() {
  const {getCartCount} = useCart()
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Image
              src="/placeholder.svg?height=32&width=100"
              alt="GreyB Logo"
              width={100}
              height={32}
            />
          </div>
          <div className="flex items-center space-x-4">
            <ul className="hidden md:flex space-x-8">
              <NavItem>Home</NavItem>
              <NavItem
                dropdownContent={
                  <>
                    <Button variant="ghost" className="w-full justify-start">Profile</Button>
                    <Button variant="ghost" className="w-full justify-start">Settings</Button>
                    <Button variant="ghost" className="w-full justify-start">Logout</Button>
                  </>
                }
              >
                Services
              </NavItem>
              <NavItem>About</NavItem>
              <NavItem>Contact</NavItem>
            </ul>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-full md:w-64 rounded-full border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <Link href={`/cart`} className="block">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{getCartCount()}</span>
            </Button>
            </Link>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

