'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import NavItem from "./nav-item"
import { Button } from "@/components/ui/button"
import { Search, ShoppingCart, User, LogOut, ClipboardList, Settings } from 'lucide-react'
import { useCart } from '@/app/contexts/CartContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"

interface Category {
  id: string;
  name: string;
  subCategories: SubCategory[];
}

interface SubCategory {
  id: string;
  name: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function NavBar() {
  const router = useRouter()
  const { getCartCount } = useCart()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    setIsLoggedIn(!!userId)
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`)
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        const data = await response.json()
        setCategories(data)
        setIsLoading(false)
      } catch (err) {
        setError('Error fetching categories')
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('userId')
    setIsLoggedIn(false)
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    })
    router.push('/')
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="https://pos.nvncdn.com/be5dfe-25943/store/20180315_FhC87q73AcS7Vcg6AbaVM8R9.png"
                alt="GreyB Logo"
                width={150}
                height={40}
                className="h-12 w-auto"
              />
            </Link>
          </div>
          <div className="flex-grow flex justify-center">
            <ul className="flex space-x-8">
              {isLoading ? (
                <li>Loading categories...</li>
              ) : error ? (
                <li>{error}</li>
              ) : (
                categories.map((category) => (
                  <NavItem
                    key={category.id}
                    dropdownContent={
                      <>
                        {category.subCategories.map((subCategory) => (
                          <Link key={subCategory.id} href={`/subcategory/${subCategory.id}`}>
                            <Button variant="ghost" className="w-full justify-start">
                              {subCategory.name}
                            </Button>
                          </Link>
                        ))}
                      </>
                    }
                  >
                    {category.name}
                  </NavItem>
                ))
              )}
            </ul>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {getCartCount()}
                </span>
              </Button>
            </Link>
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push('/order-history')}>
                    <ClipboardList className="mr-2 h-4 w-4" />
                    Order History
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

