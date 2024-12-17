'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"

const bestSellers = [
  {
    id: 1,
    title: 'T-shirts & Sweatshirts',
    image: 'https://pos.nvncdn.com/be5dfe-25943/bn/20241122_kK0eRK2F.gif',
    alt: 'Assorted t-shirts and sweatshirts',
    link: '/category/1'
  },
  {
    id: 2,
    title: 'Sweatpants',
    image: 'https://pos.nvncdn.com/be5dfe-25943/bn/20241122_h4cWBmtG.gif',
    alt: 'Sweatpants in pastel colors',
    link: '/category/2'
  },
  {
    id: 3,
    title: 'Sneakers',
    image: 'https://pos.nvncdn.com/be5dfe-25943/bn/20241122_d3Ya7fWv.gif',
    alt: 'Various white sneakers',
    link: '/category/3'
  },
  {
    id: 4,
    title: 'Accessories',
    image: 'https://pos.nvncdn.com/be5dfe-25943/bn/20241122_Z3oX9KeB.gif',
    alt: 'Assorted baseball caps',
    link: '/category/4'
  }
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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
}

export default function Category() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Our Products
        </motion.h2>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {bestSellers.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <Link href={item.link} passHref>
                <Card className="overflow-hidden group cursor-pointer">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <motion.img 
                        src={item.image} 
                        alt={item.alt}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                      <motion.div 
                        className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        <span className="text-white text-lg font-semibold">View Products</span>
                      </motion.div>
                    </div>
                    <motion.div 
                      className="p-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                    </motion.div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

