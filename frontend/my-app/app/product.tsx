'use client'

import Image from "next/image"
import { Heart } from 'lucide-react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { motion } from "framer-motion"

interface Product {
  id: number
  name: string
  price: number
  image: string
}

const products: Product[] = [
  { id: 1, name: "Spao Wide Pants", price: 450000, image: "https://pos.nvncdn.com/be5dfe-25943/ps/20241022_51wzFVFUpz.jpeg" },
  { id: 2, name: "Spao Wide Pants", price: 450000, image: "https://pos.nvncdn.com/be5dfe-25943/ps/20241022_51wzFVFUpz.jpeg" },
  { id: 3, name: "Topten Kid Polo", price: 165000, image: "https://pos.nvncdn.com/be5dfe-25943/ps/20241022_51wzFVFUpz.jpeg" },
  { id: 4, name: "Topten Kid Skirt", price: 195000, image: "https://pos.nvncdn.com/be5dfe-25943/ps/20241022_51wzFVFUpz.jpeg" },
  { id: 5, name: "Covernat Sweater", price: 350000, image: "https://pos.nvncdn.com/be5dfe-25943/ps/20241022_51wzFVFUpz.jpeg" },
  { id: 6, name: "Spao Wide Pants", price: 450000, image: "https://pos.nvncdn.com/be5dfe-25943/ps/20241022_51wzFVFUpz.jpeg" },
  { id: 7, name: "Spao Wide Pants", price: 450000, image: "https://pos.nvncdn.com/be5dfe-25943/ps/20241022_51wzFVFUpz.jpeg" },
  { id: 8, name: "Topten Kid Polo", price: 165000, image: "https://pos.nvncdn.com/be5dfe-25943/ps/20241022_51wzFVFUpz.jpeg" },
  { id: 9, name: "Topten Kid Skirt", price: 195000, image: "https://pos.nvncdn.com/be5dfe-25943/ps/20241022_51wzFVFUpz.jpeg" },
  { id: 10, name: "Covernat Sweater", price: 350000, image: "https://pos.nvncdn.com/be5dfe-25943/ps/20241022_51wzFVFUpz.jpeg" },
  { id: 11, name: "Spao Wide Pants", price: 450000, image: "https://pos.nvncdn.com/be5dfe-25943/ps/20241022_51wzFVFUpz.jpeg" },
  { id: 12, name: "Spao Wide Pants", price: 450000, image: "https://pos.nvncdn.com/be5dfe-25943/ps/20241022_51wzFVFUpz.jpeg" },
  { id: 13, name: "Topten Kid Polo", price: 165000, image: "https://pos.nvncdn.com/be5dfe-25943/ps/20241022_51wzFVFUpz.jpeg" },
  { id: 14, name: "Topten Kid Skirt", price: 195000, image: "https://pos.nvncdn.com/be5dfe-25943/ps/20241022_51wzFVFUpz.jpeg" },
  { id: 15, name: "Covernat Sweater", price: 350000, image: "https://pos.nvncdn.com/be5dfe-25943/ps/20241022_51wzFVFUpz.jpeg" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
}

export default function Product() {
  return (
    <motion.section 
      className="w-full py-12 flex items-center justify-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container max-w-6xl">
        <motion.h2 
          className="text-3xl font-bold text-center mb-2"
          variants={itemVariants}
        >
          New Arrivals
        </motion.h2>
        <motion.p 
          className="text-center text-gray-500 mb-8"
          variants={itemVariants}
        >
          Các sản phẩm mới có tại cửa hàng
        </motion.p>
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center"
          variants={containerVariants}
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={itemVariants} className="w-full max-w-[240px]">
              <Card className="relative group">
                <CardContent className="p-0 overflow-hidden">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={100}
                      height={100}
                      // fill={true}
                      style={{objectFit: "contain"}}
                      className="w-full h-auto object-cover"
                    />
                  </motion.div>
                  <motion.button 
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart className="h-4 w-4" />
                  </motion.button>
                </CardContent>
                <CardFooter className="flex flex-col items-center p-4">
                  <h3 className="font-semibold text-sm mb-1 text-center">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.price.toLocaleString()}đ</p>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}