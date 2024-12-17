'use client'

import { useState } from 'react'
import { Product, Color, Size } from '@/lib/product'
import { useCart } from '@/app/contexts/CartContext'
import { Button } from "@/components/ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ShoppingCart, Minus, Plus } from 'lucide-react'
import Link from 'next/link'
import { toast } from "@/hooks/use-toast"

interface ProductListProps {
  products: Product[]
}

export default function ProductList({ products }: ProductListProps) {
  const { addItem } = useCart()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} addItem={addItem} />
      ))}
    </div>
  )
}

interface ProductCardProps {
  product: Product
  addItem: (product: Product, colorId: string, size: string, quantity: number) => void
}

function ProductCard({ product, addItem }: ProductCardProps) {
  const [selectedColor, setSelectedColor] = useState<Color>(product.colors[0])
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const handleColorChange = (colorId: string) => {
    const newColor = product.colors.find(c => c.name === colorId)
    if (newColor) {
      setSelectedColor(newColor)
      setSelectedSize('')
      setCurrentImageIndex(0)
      setQuantity(1)
    }
  }

  const handleSizeChange = (sizeName: string) => {
    setSelectedSize(sizeName)
    setQuantity(1)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking the "Add to Cart" button
    if (selectedSize) {
      const size = selectedColor.sizes.find(s => s.name === selectedSize)
      if (size && quantity <= size.quantity) {
        addItem(product, selectedColor.name, selectedSize, quantity)
        toast({
          title: "Added to cart",
          description: `${quantity} x ${product.name} (${selectedColor.name}, ${selectedSize}) added to your cart.`,
        })
      } else {
        toast({
          title: "Error",
          description: "Not enough stock available.",
          variant: "destructive",
        })
      }
    }
  }

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking the next image button
    if (selectedColor.imagePaths.length > 1) {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % selectedColor.imagePaths.length
      )
    }
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking the previous image button
    if (selectedColor.imagePaths.length > 1) {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex - 1 + selectedColor.imagePaths.length) % selectedColor.imagePaths.length
      )
    }
  }

  const incrementQuantity = () => {
    const size = selectedColor.sizes.find(s => s.name === selectedSize)
    if (size && quantity < size.quantity) {
      setQuantity(q => q + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1)
    }
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value)
    const size = selectedColor.sizes.find(s => s.name === selectedSize)
    if (size && newQuantity >= 1 && newQuantity <= size.quantity) {
      setQuantity(newQuantity)
    }
  }

  return (
    <Link href={`/products/${product.id}`} className="block">
      <div className="border rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
        <div className="relative aspect-square bg-gray-200">
          {selectedColor.imagePaths.length > 0 ? (
            <Image
              src={selectedColor.imagePaths[currentImageIndex]}
              alt={`${product.name} in ${selectedColor.name}`}
              layout="fill"
              objectFit="cover"
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
            </>
          )}
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
          <p className="text-gray-600 mb-2">{product.brand}</p>
          <p className="text-gray-600 mb-4 text-lg">${product.price.toFixed(2)}</p>
          {product.discountedPrice < product.price && (
            <p className="text-red-600 mb-2">
              Sale: ${product.discountedPrice.toFixed(2)}
            </p>
          )}
          <div className="space-y-4 mb-4">
            <Select onValueChange={handleColorChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                {product.colors.map((color) => (
                  <SelectItem key={color.name} value={color.name}>
                    {color.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              onValueChange={handleSizeChange} 
              disabled={!selectedColor}
              value={selectedSize}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {selectedColor.sizes.map((size) => (
                  <SelectItem key={size.name} value={size.name}>
                    {size.name} ({size.quantity} available)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedSize && (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-16 text-center"
                  min={1}
                  max={selectedColor.sizes.find(s => s.name === selectedSize)?.quantity || 1}
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={incrementQuantity}
                  disabled={quantity >= (selectedColor.sizes.find(s => s.name === selectedSize)?.quantity || 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
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

