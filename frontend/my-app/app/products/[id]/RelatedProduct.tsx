'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/lib/product'
import { Button } from "@/components/ui/button"
import { Heart } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const RELATED_PRODUCT_IDS = [5, 6, 7, 8]

export default function RelatedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch all products by IDs in parallel
        const productPromises = RELATED_PRODUCT_IDS.map(id =>
          fetch(`https://maixuanhieu20215576-web.onrender.com/products/${id}`).then(res => res.json())
        )
        
        const fetchedProducts = await Promise.all(productPromises)
        setProducts(fetchedProducts.filter(Boolean)) // Filter out any null responses
      } catch (error) {
        console.error('Error fetching related products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (isLoading) {
    return <div className="h-[400px] flex items-center justify-center">Loading...</div>
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-[#1B442B] mb-6 text-center">
        Sản phẩm liên quan
      </h2>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
              <Link href={`/products/${product.id}`}>
                <div className="relative group">
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                    {product.discountedPrice < product.price && (
                      <Badge 
                        className="absolute top-2 left-2 z-10 bg-red-500"
                      >
                        -{Math.round(((product.price - product.discountedPrice) / product.price) * 100)}%
                      </Badge>
                    )}
                    <Image
                      src={product.colors[0]?.imagePaths[0].path || '/placeholder.svg'}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white"
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="mt-4 space-y-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-red-600 font-medium">
                        {product.discountedPrice.toLocaleString('vi-VN')}đ
                      </span>
                      {product.discountedPrice < product.price && (
                        <span className="text-gray-500 text-sm line-through">
                          {product.price.toLocaleString('vi-VN')}đ
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden lg:flex -left-12" />
        <CarouselNext className="hidden lg:flex -right-12" />
      </Carousel>
    </div>
  )
}

