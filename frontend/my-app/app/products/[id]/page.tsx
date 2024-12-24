import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/product'
import ProductDetail from './product-detail'
import { Breadcrumb } from "@/components/ui/breadcrumb"
import FloatingContactButtons from '@/components/FloatingContactButtons'

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  const breadcrumbItems = [
    { title: "Trang chủ", href: "/" },
    { title: "FOOTWEAR", href: "/category/footwear" },
    { title: "SNEAKERS", href: "/subcategory/sneakers" },
    { title: product.name, href: `/products/${product.id}` },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4">
        <Breadcrumb items={breadcrumbItems} />
        <ProductDetail product={product} />
      </div>
      <FloatingContactButtons />
    </div>
  )
}

