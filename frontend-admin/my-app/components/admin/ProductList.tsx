'use client'

import { useState } from "react"
import { Product } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Plus } from 'lucide-react'

interface ProductListProps {
  products: Product[]
  total: number
  currentPage: number
  subcategoryName: string
  categoryId: string
  subcategoryId: string
  hasProducts: boolean
}

export function ProductList({ products, total, currentPage, categoryId, subcategoryId, hasProducts }: ProductListProps) {
  const [skuSearch, setSkuSearch] = useState("")
  const router = useRouter()

  const handleSearch = () => {
    router.push(`/admin/categories/${categoryId}/${subcategoryId}?page=1&sku=${skuSearch}`)
  }

  if (!hasProducts) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <p className="text-lg mb-4">No products found in this subcategory.</p>
          <Link href={`/admin/products/new?subcategoryId=${subcategoryId}`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New Product
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Products</h2>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search by SKU"
            value={skuSearch}
            onChange={(e) => setSkuSearch(e.target.value)}
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Discounted Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.sku}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.brand}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>${product.discountedPrice.toFixed(2)}</TableCell>
              <TableCell>
                <Link href={`/admin/products/${product.id}`}>
                  <Button variant="outline" size="sm">Edit</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(total / 10)}
          searchParams={{ sku: skuSearch }}
        />
      </div>
    </div>
  )
}

