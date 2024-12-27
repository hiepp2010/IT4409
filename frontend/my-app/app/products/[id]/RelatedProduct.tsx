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

//const RELATED_PRODUCT_IDS = [5, 6, 7, 8]

interface RecommendedProduct {
  article_id: number;
  color: string;
  prod_name: string;
  product_type: string;
}

interface RecommendationResponse {
  article_id: number;
  method: string;
  recommendations: RecommendedProduct[];
}

interface RelatedProductsProps {
  currentSku: string;
}

export default function RelatedProducts({ currentSku }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 1. Fetch recommendations
        const url = `https://d940-104-196-207-107.ngrok-free.app/recommend/content/0${currentSku}`;

        const recommendResponse = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
        });

        if (!recommendResponse.ok) {
          throw new Error(`Error fetching recommendations: ${recommendResponse.status}`);
        }

        const recommendData: RecommendationResponse = await recommendResponse.json();
        
        // 2. Fetch products - bỏ qua sản phẩm không tồn tại
        const productPromises = recommendData.recommendations.map(async (item) => {
          try {
            const productResponse = await fetch(
              `https://maixuanhieu20215576-web.onrender.com/products/sku/${item.article_id}`,
              {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
              }
            );
            
            if (!productResponse.ok) {
              return null; // Chỉ return null, không log lỗi
            }

            return await productResponse.json();
          } catch (err) {
            return null; // Chỉ return null, không log lỗi
          }
        });
        
        const fetchedProducts = await Promise.all(productPromises);
        
        // Lọc bỏ các sản phẩm null và undefined
        const validProducts = fetchedProducts.filter((product): product is Product => 
          product !== null && product !== undefined
        );

        setProducts(validProducts);
      } catch (error) {
        console.error('Error in fetchProducts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentSku) {
      fetchProducts();
    }
  }, [currentSku]);

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

