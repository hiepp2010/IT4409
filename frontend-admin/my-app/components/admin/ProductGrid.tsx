'use client'

import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import { MoreVertical } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Product } from "@/lib/products"
import Link from "next/link"

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  const getTotalStock = (product: Product) => 
    product.colors?.reduce((total, color) => 
      total + (color.sizes?.reduce((colorTotal, size) => 
        colorTotal + (size.quantity || 0), 0) || 0)
    , 0) || 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => {
        const totalStock = getTotalStock(product)
        return (
          <Card key={product.id} className="p-6">
            <Link href={`/admin/products/${product.id}`} className="block">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-16 h-16 relative">
                    <Image
                      src={product.colors[0]?.imagePaths[0] || '/placeholder.svg'}
                      alt={product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.subcategoryId}</p>
                    <p className="text-sm font-medium mt-1">
                      {typeof product.price === 'number' 
                        ? `₫${product.price.toFixed(2)}` 
                        : 'Price not available'}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={(e) => e.preventDefault()}>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/products/${product.id}`}>
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-6">
              
                <h4 className="text-sm font-medium mb-4">Summary</h4>
                <p className="text-sm text-gray-500 mb-6">
                  {product.colors?.length || 0} color(s), 
                  {product.colors?.reduce((total, color) => total + (color.sizes?.length || 0), 0) || 0} size(s)
                </p>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Total Stock</span>
                      <span>{totalStock}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </Card>
        )
      })}
    </div>
  )
}

