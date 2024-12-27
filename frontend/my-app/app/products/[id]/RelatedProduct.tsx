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

interface RelatedProductsProps {
  productId: number
}

interface RecommendationItem {
  article_id: number;
  color: string;
  prod_name: string;
  product_type: string;
}

interface RecommendationResponse {
  article_id: number;
  method: string;
  recommendations: RecommendationItem[];
}
//const RELATED_PRODUCT_IDS = [5, 6, 7, 8]

export default function RelatedProducts({ productId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 1. Từ ID tìm SKU
        const productResponse = await fetch(`https://maixuanhieu20215576-web.onrender.com/products/${productId}`)
        if (!productResponse.ok) throw new Error('Failed to fetch product')
        const productData = await productResponse.json()
        console.log("Product Data:", productData)
        
        const sku = productData.sku
        if (!sku) {
          console.error("Không tìm thấy SKU trong product data")
          return
        }
        console.log("1. SKU của sản phẩm hiện tại:", sku)

        // 2. Dùng SKU để gọi API gợi ý
        const recommendResponse = await fetch(`https://3a19-35-231-2-27.ngrok-free.app/recommend/content/0${sku}`)
        if (!recommendResponse.ok) {
          console.error("Recommend API Error:", await recommendResponse.text())
          throw new Error('Failed to fetch recommendations')
        }
        
        const recommendData: RecommendationResponse = await recommendResponse.json()
        console.log("2. Dữ liệu từ API gợi ý:", recommendData)
        
        // 3. Với mỗi article_id, tìm sản phẩm tương ứng
        const productPromises = recommendData.recommendations.map(async item => {
          try {
            const skuResponse = await fetch(`https://maixuanhieu20215576-web.onrender.com/products/sku/${item.article_id}`)
            if (!skuResponse.ok) return null
            
            const productFromSku = await skuResponse.json()
            console.log("3. Sản phẩm tìm được từ article_id:", item.article_id, productFromSku)
            
            if (!productFromSku || !productFromSku.id) return null
            return productFromSku
          } catch (error) {
            console.error("Error fetching product from SKU:", error)
            return null
          }
        })

        const fetchedProducts = await Promise.all(productPromises)
        console.log("4. Danh sách sản phẩm cuối cùng:", fetchedProducts.filter(Boolean))
        setProducts(fetchedProducts.filter(Boolean))
      } catch (error) {
        console.error('Error details:', error)
        console.error('Error fetching related products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) {
      console.log("ProductID nhận được:", productId)
      fetchProducts()
    }
  }, [productId])

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

