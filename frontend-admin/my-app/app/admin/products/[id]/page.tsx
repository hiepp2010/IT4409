import { getProductById } from "@/lib/products"
import ProductForm from "@/components/admin/ProductForm"
import AdminSidebar from "@/components/admin/AdminSidebar"
import { notFound } from "next/navigation"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const isNewProduct = params.id === 'new'
  const product = isNewProduct ? null : await getProductById(params.id)

  if (!isNewProduct && !product) {
    notFound()
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">
            {isNewProduct ? 'Add New Product' : 'Edit Product'}
          </h1>
          <p className="text-gray-500">
            Home {">"} All Products {">"} {isNewProduct ? 'Add New Product' : 'Edit Product'}
          </p>
        </div>
        <ProductForm initialData={product} isNewProduct={isNewProduct} />
      </div>
    </div>
  )
}

