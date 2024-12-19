import { getCategoryById } from "@/lib/categories"
import { getProducts } from "@/lib/products"
import AdminSidebar from "@/components/admin/AdminSidebar"
import { ProductList } from "@/components/admin/ProductList"
import { notFound } from "next/navigation"

interface SubcategoryProductsPageProps {
  params: Promise<{
    categoryId: string
    subcategoryId: string
  }>
  searchParams: Promise<{ 
    page?: string
    sku?: string 
  }>
}

export default async function SubcategoryProductsPage({ params, searchParams }: SubcategoryProductsPageProps) {
  const { categoryId, subcategoryId } = await params
  const { page, sku } = await searchParams
  const category = await getCategoryById(categoryId)

  if (!category) {
    notFound()
  }

  const subcategory = category.subCategories.find(sc => sc.id === subcategoryId)

  if (!subcategory) {
    notFound()
  }

  const currentPage = Number(page) || 1
  const limit = 10
  const { products, total } = await getProducts(currentPage, limit, subcategoryId, sku)

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
            subcategoryId={subcategoryId}
            categoryId={categoryId}
            subcategoryName={subcategory.name}
            hasProducts={products.length > 0}
          />
        </div>
      </div>
    </div>
  )
}

