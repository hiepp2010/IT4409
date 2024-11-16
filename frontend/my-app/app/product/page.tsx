'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight} from 'lucide-react'
import { Button } from "@/components/ui/button"
import NavBar from '../navbar'
import Footer from '../footer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const productImages = [
  "https://pos.nvncdn.com/be5dfe-25943/ps/20211201_aMPYIVVvhqeCwuJKuPOAX1eV.jpg",
  "https://pos.nvncdn.com/be5dfe-25943/ps/20201128_3GwjLK6b9lnOizneBANpJg8S.jpg",
  "https://pos.nvncdn.com/be5dfe-25943/ps/20201128_ZT7AnTKIAmEuuT2P9znYoJY3.jpg",
  "https://pos.nvncdn.com/be5dfe-25943/ps/20201128_3GwjLK6b9lnOizneBANpJg8S.jpg",
  "https://pos.nvncdn.com/be5dfe-25943/ps/20201128_3GwjLK6b9lnOizneBANpJg8S.jpg",
]

const sizes = ['35', '36', '36.5', '37.5', '37', '38', '39.5', '39', '40', '41', '42.5']

export default function ProductPage() {
  const [currentImage, setCurrentImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  return (
    <div>
           <header className="sticky top-0 z-50 bg-grey shadow-md">
        <NavBar></NavBar>
      </header>
    <div className="container mx-auto px-4 py-8">
          

      <nav className="text-sm mb-8">
        <Link href="/" className="text-gray-500 hover:text-gray-700">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link href="/footwear" className="text-gray-500 hover:text-gray-700">FOOTWEAR</Link>
        <span className="mx-2">/</span>
        <Link href="/sneakers" className="text-gray-500 hover:text-gray-700">SNEAKERS</Link>
      </nav>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <div className="relative aspect-square mb-4">
            <Image
              src={productImages[currentImage]}
              alt="Converse 70s Hightop"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 left-4 transform -translate-y-1/2"
              onClick={() => setCurrentImage((prev) => (prev === 0 ? productImages.length - 1 : prev - 1))}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-4 transform -translate-y-1/2"
              onClick={() => setCurrentImage((prev) => (prev === productImages.length - 1 ? 0 : prev + 1))}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex space-x-2 overflow-x-auto">
            {productImages.map((image, index) => (
              <button
                key={index}
                className={`p-1 w-[60px] h-[60px] flex-shrink-0 ${index === currentImage ? 'ring-2 ring-gray-400' : ''}`}
                onClick={() => setCurrentImage(index)}
              >
                <Image src={image} alt={`Thumbnail ${index + 1}`} width={60} height={60} className="object-cover w-full h-full" />
              </button>
            ))}
          </div>

        </div>

        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">Converse 70s Hightop</h1>
          <p className="text-gray-600 mb-4">Mã hàng: CV0954</p>
          <p className="text-2xl font-bold text-red-600 mb-6">1,550,000đ</p>

          <div className="mb-6">
            <h2 className="font-semibold mb-2">Chọn size</h2>
            <div className="grid grid-cols-5 gap-2">
              {sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <Button className="w-full bg-green-700 hover:bg-green-800 text-white mb-4">
            MUA NGAY
          </Button>
          <Button variant="outline" className="w-full mb-6">
            THÊM VÀO GIỎ HÀNG
          </Button>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="details">
              <AccordionTrigger>Thông tin chi tiết</AccordionTrigger>
              <AccordionContent>
                [Thông tin]
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="warranty">
              <AccordionTrigger>Chính sách bảo hành</AccordionTrigger>
              <AccordionContent>
                [Chính sách]
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="exchange">
              <AccordionTrigger>Chính sách đổi hàng</AccordionTrigger>
              <AccordionContent>
                [Exchange policy would go here]
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
    <Footer></Footer>

    </div>
  )
}