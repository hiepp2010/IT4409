import { getProductById } from "@/lib/products"
import ProductForm from "@/components/admin/ProductForm"
import AdminSidebar from "@/components/admin/AdminSidebar"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = params.id !== 'new' ? await getProductById(params.id) : null

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Product Details</h1>
          <p className="text-gray-500">Home {">"} All Products {">"} Product Details</p>
        </div>
        <ProductForm initialData={product} />
      </div>
    </div>
  )
}

