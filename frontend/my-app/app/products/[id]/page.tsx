import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/product'
import ProductDetail from './productdetail'
import FloatingContactButtons from '@/components/clients/FloatingContactButton'

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const {id} = await params;
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4">
        <ProductDetail product={product} />
      </div>
      <FloatingContactButtons />
    </div>
  )
}

