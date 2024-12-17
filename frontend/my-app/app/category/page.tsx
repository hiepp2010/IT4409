'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

import NavBar from '../../components/clients/navbar'
import Footer from '../../components/clients/footer'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const products = [
  { id: 1, name: "Converse 70s Hightop", price: 1550000, image: "https://pos.nvncdn.com/be5dfe-25943/ps/20201007_ozIeoa7z6Rdf7MdM5E3sRo4W.jpg" },
  { id: 2, name: "Converse Classic Hightop White", price: 645000, originalPrice: 950000, discount: 30, image: "https://pos.nvncdn.com/be5dfe-25943/ps/20201007_ozIeoa7z6Rdf7MdM5E3sRo4W.jpg" },
  { id: 3, name: "Converse 70s Lowtop", price: 1450000, image: "https://pos.nvncdn.com/be5dfe-25943/ps/20201007_ozIeoa7z6Rdf7MdM5E3sRo4W.jpg" },
  { id: 4, name: "New Balance 550", price: 2450000, originalPrice: 3500000, discount: 30, image: "https://pos.nvncdn.com/be5dfe-25943/ps/20201007_ozIeoa7z6Rdf7MdM5E3sRo4W.jpg" },
  { id: 5, name: "New Balance 550 Beige", price: 2450000, originalPrice: 3500000, discount: 30, image: "https://pos.nvncdn.com/be5dfe-25943/ps/20201007_ozIeoa7z6Rdf7MdM5E3sRo4W.jpg" },
  { id: 6, name: "New Balance 550 White Blue", price: 2450000, originalPrice: 3500000, discount: 30, image: "https://pos.nvncdn.com/be5dfe-25943/ps/20201007_ozIeoa7z6Rdf7MdM5E3sRo4W.jpg" },
]

const categories = ['TOP', 'BOTTOM', 'FOOTWEAR', 'ACCESSORIES']
const brands = ['Converse', 'MLB', 'UGG', 'Newbalance', 'Akiii']
const priceRanges = [
  'Dưới 500,000đ',
  'Từ 500,000đ đến 750,000đ',
  'Từ 750,000đ đến 1,000,000đ',
  'Từ 1,000,000đ đến 1,500,000đ'
]

export default function SneakersPage() {
  const [sortBy, setSortBy] = useState('newest')

  return (
    <div className="container mx-auto px-4 py-8">
      <NavBar></NavBar>

      <h1 className="text-4xl font-bold text-center mb-8 py-8">SNEAKERS</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Bộ lọc</h2>
            <div className="space-y-2">
              <h3 className="font-medium">Sản phẩm</h3>
              {categories.map((category) => (
                <div key={category} className="flex items-center">
                  <Checkbox id={category} />
                  <label htmlFor={category} className="ml-2 text-sm">{category}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h3 className="font-medium mb-2">Thương hiệu</h3>
            {brands.map((brand) => (
              <div key={brand} className="flex items-center">
                <Checkbox id={brand} />
                <label htmlFor={brand} className="ml-2 text-sm">{brand}</label>
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-medium mb-2">Giá</h3>
            {priceRanges.map((range) => (
              <div key={range} className="flex items-center">
                <Checkbox id={range} />
                <label htmlFor={range} className="ml-2 text-sm">{range}</label>
              </div>
            ))}
          </div>
        </aside>

        <main className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">Tìm thấy {products.length} sản phẩm</p>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="price-asc">Giá tăng dần</SelectItem>
                <SelectItem value="price-desc">Giá giảm dần</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="relative group">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {product.discount && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                        -{product.discount}%
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start p-4">
                  <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                  <div className="flex items-center">
                    <span className="text-sm font-bold text-red-600 mr-2">
                      {product.price.toLocaleString()}đ
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-500 line-through">
                        {product.originalPrice.toLocaleString()}đ
                      </span>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
      </div>
      <Footer></Footer>
    </div>
  )
}