import { notFound } from 'next/navigation'
import { getProducts } from '@/lib/product'
import ProductList from '@/components/clients/ProductList'
import Pagination from '@/components/clients/Pagination'

const ITEMS_PER_PAGE = 20

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getSubcategoryData(subcategoryId: string) {
  const response = await fetch(`${API_URL}/subcategories/${subcategoryId}`);
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch subcategory');
  }
  return response.json();
}

export default async function SubcategoryPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ subcategoryId: string }>,
  searchParams: Promise<{ page?: string }>
}) {
  const {subcategoryId} = await params;
  const page = Number((await searchParams).page) || 1;
  const subcategory = await getSubcategoryData(subcategoryId);

  if (!subcategory) {
    notFound();
  }

  const { products, total } = await getProducts(page, ITEMS_PER_PAGE, subcategoryId);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{subcategory.name}</h1>
      <ProductList products={products} />
      <div className="mt-8">
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  )
}

