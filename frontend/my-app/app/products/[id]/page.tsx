'use client'

import {use} from 'react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Truck, ArrowLeftRight, Shield } from 'lucide-react'
import { Button } from "@/components/ui/button"
import NavBar from '@/app/component/navbar'
import Footer from '@/app/footer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { getProductById, Product, Color, Size } from '@/lib/product'
import { useCart } from '@/app/contexts/CartContext'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

type ProductPageProps = Promise<{
  id:string
}>

export default  function ProductPage(props: { params: ProductPageProps }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedColor, setSelectedColor] = useState<Color | null>(null)
  const [selectedSize, setSelectedSize] = useState<Size | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { addItem } = useCart()
  const {toast} = useToast()
  const params = use(props.params)
  const id = params.id



  useEffect(() => {
    async function fetchProduct() {
      const fetchedProduct = await getProductById(id)
      if (fetchedProduct) {
        setProduct(fetchedProduct)
        setSelectedColor(fetchedProduct.color[0])
      }
    }
    fetchProduct()
  }, [id])

  useEffect(() => {
    if (selectedColor) {
      setCurrentImageIndex(0)
      setSelectedSize(null)
    }
  }, [selectedColor])

  if (!product || !selectedColor) {
    return <div>Loading...</div>
  }

  const handleColorChange = (colorId: string) => {
    const newColor = product.color.find(c => c.id === colorId)
    if (newColor) {
      setSelectedColor(newColor)
    }
  }

  const handleSizeChange = (size: string) => {
    const newSize = selectedColor.size.find(s => s.size === size)
    if (newSize) {
      setSelectedSize(newSize)
    }
  }

  const handleAddToCart = () => {
    if (product && selectedColor && selectedSize) {
      addItem(product, selectedColor.id, selectedSize.size)
      toast({
        title: "Thêm vào giỏ hàng thành công",
        description: `${product.name} - ${selectedColor.color_name}, Size ${selectedSize.size}`,
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <nav className="text-sm mb-8">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Trang chủ</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="text-gray-500 hover:text-gray-700">Sản phẩm</Link>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              <div className="relative aspect-[4/3] mb-4">
                <Image
                  src={selectedColor.image[currentImageIndex]}
                  alt={`${product.name} in ${selectedColor.color_name}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 left-4 transform -translate-y-1/2"
                  onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? selectedColor.image.length - 1 : prev - 1))}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 right-4 transform -translate-y-1/2"
                  onClick={() => setCurrentImageIndex((prev) => (prev === selectedColor.image.length - 1 ? 0 : prev + 1))}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex space-x-2 overflow-x-auto">
                {selectedColor.image.map((image, index) => (
                  <button
                    key={index}
                    className={`p-1 w-[80px] h-[80px] flex-shrink-0 border rounded ${index === currentImageIndex ? 'border-primary' : 'border-gray-200'}`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image src={image} alt={`Thumbnail ${index + 1}`} width={80} height={80} className="object-contain w-full h-full" />
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-1/3">
              <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
              <p className="text-3xl font-bold text-red-600 mb-6">{product.price.toLocaleString('vi-VN')}đ</p>

              <div className="mb-6">
                <h2 className="font-semibold mb-2">Chọn màu</h2>
                <Select onValueChange={handleColorChange} value={selectedColor.id}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn màu" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.color.map((color) => (
                      <SelectItem key={color.id} value={color.id}>
                        {color.color_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-6">
                <h2 className="font-semibold mb-2">Chọn size</h2>
                <Select onValueChange={handleSizeChange} value={selectedSize?.size || ''}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn size" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedColor.size.map((size) => (
                      <SelectItem key={size.size} value={size.size}>
                        {size.size} 
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="w-full bg-red-600 hover:bg-red-700 text-white mb-4 h-12"
                onClick={handleAddToCart}
                disabled={!selectedSize}
              >
                THÊM VÀO GIỎ HÀNG
              </Button>

              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <Truck className="w-6 h-6 mr-2" />
                  <span>Giao hàng miễn phí toàn quốc</span>
                </div>
                <div className="flex items-center">
                  <ArrowLeftRight className="w-6 h-6 mr-2" />
                  <span>Đổi trả trong vòng 30 ngày</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-6 h-6 mr-2" />
                  <span>Bảo hành 12 tháng</span>
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="details">
                  <AccordionTrigger>Thông tin chi tiết</AccordionTrigger>
                  <AccordionContent>
                    <p>{product.name} - {selectedColor.color_name}</p>
                    <p>Giá: {product.price.toLocaleString('vi-VN')}đ</p>
                    <p>Các size có sẵn: {selectedColor.size.map(s => s.size).join(', ')}</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="warranty">
                  <AccordionTrigger>Chính sách bảo hành</AccordionTrigger>
                  <AccordionContent>
                    <p>Sản phẩm được bảo hành 12 tháng cho các lỗi do nhà sản xuất. Quý khách vui lòng liên hệ với cửa hàng nơi mua hàng hoặc trung tâm bảo hành chính hãng để được hỗ trợ.</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="exchange">
                  <AccordionTrigger>Chính sách đổi hàng</AccordionTrigger>
                  <AccordionContent>
                    <p>Quý khách có thể đổi hàng trong vòng 30 ngày kể từ ngày mua hàng nếu sản phẩm chưa qua sử dụng và còn nguyên tem mác. Vui lòng giữ hóa đơn mua hàng để được hỗ trợ tốt nhất.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

