'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Product } from '@/lib/product'
import { toast } from "@/hooks/use-toast"

interface CartItem {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, colorId: string, size: string, quantity: number) => void;
  removeItem: (productId: string, colorId: string, size: string) => void;
  adjustQuantity: (productId: string, colorId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product: Product, colorId: string, size: string, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        item => item.product.id === product.id && item.selectedColor === colorId && item.selectedSize === size
      )

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems]
        const existingItem = updatedItems[existingItemIndex]
        const selectedColor = product.colors.find(c => c.name === colorId)
        const selectedSize = selectedColor?.sizes.find(s => s.name === size)
        
        if (selectedSize) {
          const newQuantity = existingItem.quantity + quantity
          if (newQuantity <= selectedSize.quantity) {
            existingItem.quantity = newQuantity
            toast({
              title: "Updated cart",
              description: `${product.name} quantity updated to ${newQuantity}.`,
            })
          } else {
            toast({
              title: "Error",
              description: `Cannot add more ${product.name}. Maximum stock reached.`,
              variant: "destructive",
            })
          }
        }
        
        return updatedItems
      } else {
        toast({
          title: "Added to cart",
          description: `${quantity} x ${product.name} added to your cart.`,
        })
        return [...prevItems, { product, selectedColor: colorId, selectedSize: size, quantity }]
      }
    })
  }, [])

  const removeItem = useCallback((productId: string, colorId: string, size: string) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.filter(
        item => !(item.product.id === productId && item.selectedColor === colorId && item.selectedSize === size)
      )
      if (updatedItems.length < prevItems.length) {
        toast({
          title: "Removed from cart",
          description: "Item removed from your cart.",
        })
      }
      return updatedItems
    })
  }, [])

  const adjustQuantity = useCallback((productId: string, colorId: string, size: string, quantity: number) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.map(item => {
        if (item.product.id === productId && item.selectedColor === colorId && item.selectedSize === size) {
          const selectedColor = item.product.colors.find(c => c.name === colorId)
          const selectedSize = selectedColor?.sizes.find(s => s.name === size)
          
          if (selectedSize && quantity > 0 && quantity <= selectedSize.quantity) {
            return { ...item, quantity }
          } else if (quantity <= 0) {
            toast({
              title: "Removed from cart",
              description: "Item removed from your cart.",
            })
            return null
          } else {
            toast({
              title: "Error",
              description: `Cannot update quantity. Maximum stock is ${selectedSize?.quantity}.`,
              variant: "destructive",
            })
            return item
          }
        }
        return item
      }).filter((item): item is CartItem => item !== null)
      
      return updatedItems
    })
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    })
  }, [])

  const getCartCount = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }, [items])

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, adjustQuantity, clearCart, getCartCount }}>
      {children}
    </CartContext.Provider>
  )
}

