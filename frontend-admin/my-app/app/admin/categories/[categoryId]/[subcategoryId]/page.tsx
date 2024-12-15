import { getCategories } from "@/lib/categories"
import { getProducts } from "@/lib/products"
import AdminSidebar from "@/components/admin/AdminSidebar"
import { ProductList } from "@/components/admin/ProductList"
import { notFound } from "next/navigation"

interface SubcategoryProductsPageProps {
  params: {
    categoryId: string
    subcategoryId: string
  }
  searchParams: { page?: string; sku?: string }
}

export default async function SubcategoryProductsPage({ params, searchParams }: SubcategoryProductsPageProps) {
  const categories = await getCategories()
  const category = categories.find(c => c.id === params.categoryId)
  const subcategory = category?.subCategories.find(sc => sc.id === params.subcategoryId)

  if (!category || !subcategory) {
    notFound()
  }

  const currentPage = Number(searchParams.page) || 1
  const limit = 10
  const { products, total } = await getProducts(currentPage, limit, subcategory.name, searchParams.sku)

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1">
        <div className="p-8">
          <h1 className="text-2xl font-semibold mb-6">{category.name} - {subcategory.name} Products</h1>
          <ProductList 
            products={products} 
            total={total} 
            currentPage={currentPage} 
            subcategoryName={subcategory.name}
            categoryId={params.categoryId}
            subcategoryId={params.subcategoryId}
          />
        </div>
      </div>
    </div>
  )
}

