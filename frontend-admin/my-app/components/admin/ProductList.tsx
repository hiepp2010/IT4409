'use client'

import { useState } from "react"
import { Product } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination"
import { useRouter } from "next/navigation"

interface ProductListProps {
  products: Product[]
  total: number
  currentPage: number
  subcategoryName: string
  categoryId: string
  subcategoryId: string
}

export function ProductList({ products, total, currentPage, subcategoryName, categoryId, subcategoryId }: ProductListProps) {
  const [skuSearch, setSkuSearch] = useState("")
  const router = useRouter()

  const handleSearch = () => {
    router.push(`/admin/categories/${categoryId}/${subcategoryId}?page=1&sku=${skuSearch}`)
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
            <TableHead>Regular Price</TableHead>
            <TableHead>Sale Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.sku}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.brand}</TableCell>
              <TableCell>${product.regularPrice.toFixed(2)}</TableCell>
              <TableCell>${product.salePrice.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(total / 10)}
        />
      </div>
    </div>
  )
}

