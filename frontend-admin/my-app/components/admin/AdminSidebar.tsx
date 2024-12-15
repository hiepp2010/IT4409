'use client'

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, FolderTree } from 'lucide-react'
import Image from "next/image"
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'All Products', href: '/admin/products', icon: Package },
  { name: 'Orders List', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Categories', href: '/admin/categories', icon: FolderTree },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <div className="w-64 min-h-screen bg-white border-r flex flex-col">
      <div className="p-6 flex-grow">
        <Image
          src="/placeholder.svg"
          alt="Logo"
          width={120}
          height={40}
          className="mb-8"
        />
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md",
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <item.icon className={cn(
                  "mr-3 h-5 w-5",
                  isActive ? "text-blue-600" : "text-gray-400"
                )} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="p-6 border-t">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}

