import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from 'lucide-react'
import ProductGrid from "@/components/admin/ProductGrid"
import AdminSidebar from "@/components/admin/AdminSidebar"
import { getProducts } from "@/lib/products"

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1">
        <div className="p-8">
          <div className="mb-8 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">All Products</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-10 w-[300px]"
                />
              </div>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
          </div>
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  )
}

