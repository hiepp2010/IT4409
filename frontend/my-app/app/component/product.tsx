'use client'

import { useState } from 'react'
import { Product, Color, Size } from '@/lib/product'
import { useCart } from '../contexts/CartContext'
import { Button } from "@/components/ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

interface ProductListProps {
  products: Product[]
}

export default function ProductList({ products }: ProductListProps) {
  const { addItem } = useCart()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} addItem={addItem} />
        ))}
      </div>
    </div>
  )
}

interface ProductCardProps {
  product: Product
  addItem: (product: Product, colorId: string, size: string) => void
}

function ProductCard({ product, addItem }: ProductCardProps) {
  const [selectedColor, setSelectedColor] = useState<Color>(product.color[0])
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleColorChange = (colorId: string) => {
    const newColor = product.color.find(c => c.id === colorId)
    if (newColor) {
      setSelectedColor(newColor)
      setSelectedSize('')
      setCurrentImageIndex(0)
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking the "Add to Cart" button
    if (selectedSize) {
      addItem(product, selectedColor.id, selectedSize)
    }
  }

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking the next image button
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % selectedColor.image.length
    )
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking the previous image button
    setCurrentImageIndex((prevIndex) => 
      (prevIndex - 1 + selectedColor.image.length) % selectedColor.image.length
    )
  }

  return (
    <Link href={`/products/${product.id}`} className="block">
      <div className="border rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
        <div className="relative aspect-square">
          <Image
            src={selectedColor.image[currentImageIndex]}
            alt={`${product.name} in ${selectedColor.color_name}`}
            layout="fill"
            objectFit="cover"
          />
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={prevImage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={nextImage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
          <p className="text-gray-600 mb-4 text-lg">${product.price.toFixed(2)}</p>
          <div className="space-y-4 mb-4">
            <Select onValueChange={handleColorChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                {product.color.map((color) => (
                  <SelectItem key={color.id} value={color.id}>
                    {color.color_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              onValueChange={setSelectedSize} 
              disabled={!selectedColor}
              value={selectedSize}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select size" />
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
            onClick={handleAddToCart} 
            disabled={!selectedSize}
            className="w-full"
          >
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  )
}

