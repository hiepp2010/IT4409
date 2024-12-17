import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/lib/product'

interface ProductGridProps {
  products: Product[]
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="relative group">
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
            <Image
              src={product.colors[0]?.imagePaths[0] || '/placeholder.png'}
              alt={product.name}
              width={300}
              height={300}
              className="object-cover object-center w-full h-full group-hover:opacity-75 transition-opacity duration-300"
            />
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                <Link href={`/product/${product.id}`}>
                  <span aria-hidden="true" className="absolute inset-0" />
                  {product.name}
                </Link>
              </h3>
              <p className="mt-1 text-sm text-gray-500">{product.brand}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-red-600">${product.discountedPrice.toFixed(2)}</p>
              {product.discountedPrice < product.price && (
                <p className="text-sm text-gray-500 line-through">${product.price.toFixed(2)}</p>
              )}
            </div>
          </div>
          {product.discountedPrice < product.price && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
              -{(((product.price - product.discountedPrice) / product.price) * 100).toFixed(0)}%
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ProductGrid

