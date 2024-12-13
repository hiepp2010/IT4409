'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Product } from '@/lib/product'

interface CartItem {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, colorId: string, size: string, quantity?: number) => void;
  removeItem: (productId: string, colorId: string, size: string) => void;
  adjustQuantity: (productId: string, colorId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Mock authentication state
const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  return { isLoggedIn, login: () => setIsLoggedIn(true), logout: () => setIsLoggedIn(false) }
}

// Mock API call
const sendCartToBackend = async (items: CartItem[]) => {
  console.log('Sending cart to backend:', items)
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))
  return { success: true }
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const { isLoggedIn } = useAuth()

  const saveCart = useCallback(async (cartItems: CartItem[]) => {
    if (isLoggedIn) {
      await sendCartToBackend(cartItems)
    } else {
      localStorage.setItem('cart', JSON.stringify(cartItems))
    }
  }, [isLoggedIn])

  const loadCart = useCallback(async () => {
    if (isLoggedIn) {
      // In a real app, you would fetch the cart from the backend here
      console.log('Fetching cart from backend')
      // For this example, we'll just use what's in localStorage
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    } else {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    }
  }, [isLoggedIn])

  useEffect(() => {
    loadCart()
  }, [loadCart])

  useEffect(() => {
    saveCart(items)
  }, [items, saveCart])

  const addItem = useCallback((product: Product, colorId: string, size: string, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        item => item.product.id === product.id && item.selectedColor === colorId && item.selectedSize === size
      )

      if (existingItemIndex > -1) {
        // Item exists, increase quantity
        return prevItems.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        // New item, add to cart
        return [...prevItems, { product, selectedColor: colorId, selectedSize: size, quantity }]
      }
    })
  }, [])

  const removeItem = useCallback((productId: string, colorId: string, size: string) => {
    setItems((prevItems) => prevItems.filter(
      item => !(item.product.id === productId && item.selectedColor === colorId && item.selectedSize === size)
    ))
  }, [])

  const adjustQuantity = useCallback((productId: string, colorId: string, size: string, quantity: number) => {
    setItems((prevItems) => prevItems.map(item => 
      (item.product.id === productId && item.selectedColor === colorId && item.selectedSize === size)
        ? { ...item, quantity: Math.max(0, quantity) }
        : item
    ).filter(item => item.quantity > 0)) // Remove item if quantity is 0 or less
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
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

