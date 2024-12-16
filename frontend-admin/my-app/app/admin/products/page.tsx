import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from 'lucide-react'
import ProductGrid from "@/components/admin/ProductGrid"
import AdminSidebar from "@/components/admin/AdminSidebar"
import { getProducts } from "@/lib/products"
import Link from "next/link"
import { Pagination } from "@/components/ui/pagination"

interface ProductsPageProps {
  searchParams: { page?: string; sku?: string }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const currentPage = Number(searchParams.page) || 1
  const limit = 9
  const { products, total } = await getProducts(currentPage, limit, undefined, searchParams.sku)

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1">
        <div className="p-8">
          <div className="mb-8 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">All Products</h1>
              <div className="relative flex items-center">
                <Search className="absolute left-3 text-gray-400 h-4 w-4" />
                <form action="/admin/products" method="GET" className="flex items-center">
                  <Input 
                    name="sku"
                    placeholder="Search by SKU..." 
                    className="pl-10 w-[300px]"
                    defaultValue={searchParams.sku}
                  />
                  <input type="hidden" name="page" value="1" />
                  <Button type="submit" className="ml-2">
                    Search
                  </Button>
                </form>
              </div>
            </div>
            <Button asChild>
              <Link href="/admin/products/new">
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Link>
            </Button>
          </div>
          <ProductGrid products={products} />
          <div className="mt-8 flex justify-center">
            <Pagination 
              currentPage={currentPage} 
              totalPages={Math.ceil(total / limit)}
              searchParams={searchParams}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

