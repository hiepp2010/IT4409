'use client'

import { useCart } from "../contexts/CartContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from 'next/image'
import Link from 'next/link'
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CartPage() {
  const { items, removeItem, adjustQuantity } = useCart()
  const [isSticky, setIsSticky] = useState(false)

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = 0 // You can modify this based on your shipping logic
  const total = subtotal + shipping

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleQuantityChange = (
    productId: string, 
    colorId: string, 
    size: string, 
    newQuantity: number,
    maxQuantity: number
  ) => {
    const validQuantity = Math.min(Math.max(1, newQuantity), maxQuantity)
    adjustQuantity(productId, colorId, size, validQuantity)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Giỏ Hàng Của Bạn</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Cart Section */}
        <div className="flex-1">
          <AnimatePresence>
            {items.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 bg-gray-50 rounded-lg"
              >
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4 text-lg">Giỏ hàng của bạn đang trống</p>
                <Link href="/">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Tiếp Tục Mua Sắm
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {items.map((item) => {
                  const color = item.product.color.find(c => c.id === item.selectedColor)
                  const size = color?.size.find(s => s.size === item.selectedSize)
                  const maxQuantity = size?.quantity || 0

                  return (
                    <motion.div
                      key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex gap-6 border-b pb-6"
                    >
                      <div className="w-32 h-32 relative flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={color?.image[0] || '/placeholder.svg'}
                          alt={item.product.name}
                          fill
                          className="object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{item.product.name}</h3>
                            <p className="text-sm text-gray-500">MSP: {item.product.id}</p>
                            <p className="text-sm text-gray-500">
                              Màu: {color?.color_name} | Kích thước: {item.selectedSize}
                            </p>
                          </div>
                          <p className="font-semibold text-lg">${item.product.price.toFixed(2)}</p>
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleQuantityChange(
                                item.product.id, 
                                item.selectedColor, 
                                item.selectedSize, 
                                item.quantity - 1,
                                maxQuantity
                              )}
                              disabled={item.quantity <= 1}
                              className="h-8 w-8"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(
                                item.product.id,
                                item.selectedColor,
                                item.selectedSize,
                                parseInt(e.target.value) || 1,
                                maxQuantity
                              )}
                              className="w-16 text-center h-8"
                              min={1}
                              max={maxQuantity}
                            />
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleQuantityChange(
                                item.product.id, 
                                item.selectedColor, 
                                item.selectedSize, 
                                item.quantity + 1,
                                maxQuantity
                              )}
                              disabled={item.quantity >= maxQuantity}
                              className="h-8 w-8"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="font-semibold text-lg">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </p>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeItem(item.product.id, item.selectedColor, item.selectedSize)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary Section */}
        <motion.div 
          className={`lg:w-80 ${isSticky ? 'lg:sticky lg:top-4' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Tổng Đơn Hàng</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span>{shipping === 0 ? 'Miễn phí' : `$${shipping}`}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Tổng cộng:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6">
                Thanh Toán
              </Button>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Đăng Ký Nhận Thông Tin</h3>
            <p className="text-sm text-gray-600 mb-4">Nhận thông tin ưu đãi và xu hướng mới nhất</p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Email của bạn" 
                className="flex-1"
              />
              <Button variant="outline">
                Đăng Ký
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

