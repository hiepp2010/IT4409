'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/lib/product'
import { useCart } from '@/app/contexts/CartContext'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import RelatedProducts from './RelatedProduct'

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addItem } = useCart()
  const [selectedColor] = useState(product.colors[0])
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const discountPercentage = Math.round(
    ((product.price - product.discountedPrice) / product.price) * 100
  )

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        description: "You must select a size before adding to cart",
        variant: "destructive",
      })
      return
    }

    const size = selectedColor.sizes.find(s => s.name === selectedSize)
    if (size && size.quantity > 0) {
      addItem(product, selectedColor.name, selectedSize, 1)
      toast({
        title: "Added to cart",
        description: `${product.name} (${selectedColor.name}, ${selectedSize}) added to your cart.`,
      })
    } else {
      toast({
        title: "Error",
        description: "Selected size is out of stock.",
        variant: "destructive",
      })
    }
  }

  const handleBuyNow = () => {
    handleAddToCart()
    // Navigate to checkout
    window.location.href = '/checkout'
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {discountPercentage > 0 && (
              <Badge className="absolute top-4 left-4 bg-red-500 z-10">
                -{discountPercentage}%
              </Badge>
            )}
            {selectedColor.imagePaths.length > 0 ? (
              <Image
                src={selectedColor.imagePaths[currentImageIndex]}
                alt={`${product.name} in ${selectedColor.name}`}
                fill
                className="object-contain"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                No image available
              </div>
            )}
            {selectedColor.imagePaths.length > 1 && (
              <>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={() => setCurrentImageIndex((prev) => 
                    (prev - 1 + selectedColor.imagePaths.length) % selectedColor.imagePaths.length
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={() => setCurrentImageIndex((prev) => 
                    (prev + 1) % selectedColor.imagePaths.length
                  )}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {selectedColor.imagePaths.map((path, index) => (
              <button
                key={index}
                className={cn(
                  "relative w-20 h-20 border-2 rounded-lg overflow-hidden flex-shrink-0",
                  currentImageIndex === index ? "border-primary" : "border-transparent"
                )}
                onClick={() => setCurrentImageIndex(index)}
              >
                <Image
                  src={path}
                  alt={`${product.name} view ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1B442B]">{product.name}</h1>
            <p className="text-gray-600 mt-1">Mã hàng: {product.sku}</p>
            <div className="mt-4 space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-red-600">
                  {product.discountedPrice.toLocaleString('vi-VN')}đ
                </span>
                {product.discountedPrice < product.price && (
                  <span className="text-gray-500 line-through">
                    {product.price.toLocaleString('vi-VN')}đ
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Chọn size</h3>
              <div className="flex flex-wrap gap-2">
                {selectedColor.sizes.map((size) => (
                  <button
                    key={size.name}
                    className={cn(
                      "px-4 py-2 border rounded-md transition-colors",
                      selectedSize === size.name
                        ? "border-primary bg-primary text-white"
                        : "border-gray-200 hover:border-primary",
                      size.quantity === 0 && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => size.quantity > 0 && setSelectedSize(size.name)}
                    disabled={size.quantity === 0}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
              <button className="text-sm text-blue-600 hover:underline mt-2">
                Hướng dẫn chọn size
              </button>
            </div>

            <div className="flex gap-4">
              <Button 
                className="flex-1 h-12 bg-[#1B442B] hover:bg-[#153521]"
                onClick={handleBuyNow}
                disabled={!selectedSize}
              >
                MUA NGAY
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 border-[#1B442B] text-[#1B442B]"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            <Button 
              variant="outline" 
              className="w-full h-12 border-[#1B442B] text-[#1B442B] hover:bg-[#1B442B] hover:text-white"
              onClick={handleAddToCart}
              disabled={!selectedSize}
            >
              THÊM VÀO GIỎ HÀNG
            </Button>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="details">
              <AccordionTrigger>Thông tin chi tiết</AccordionTrigger>
              <AccordionContent>
                <div className="prose max-w-none">
                  <p>{product.description}</p>
                  
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="warranty">
              <AccordionTrigger>Chính sách bảo hành</AccordionTrigger>
              <AccordionContent>
                <div className="prose max-w-none">
                  <ul className="list-disc pl-4 space-y-2">
                    <li>Bảo hành 30 ngày cho các lỗi từ nhà sản xuất</li>
                    <li>Hỗ trợ bảo hành trọn đời với các vấn đề về keo, đế</li>
                    <li>Vệ sinh miễn phí trọn đời sản phẩm</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="exchange">
              <AccordionTrigger>Chính sách đổi hàng</AccordionTrigger>
              <AccordionContent>
                <div className="prose max-w-none">
                  <ul className="list-disc pl-4 space-y-2">
                    <li>Đổi hàng trong vòng 7 ngày</li>
                    <li>Sản phẩm còn nguyên tem mác, chưa qua sử dụng</li>
                    <li>Áp dụng đổi size hoặc mẫu khác cùng giá trị</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <RelatedProducts currentSku={product.sku} />
    </>
  )
}

