import { getCategoryById } from "@/lib/categories"
import AdminSidebar from "@/components/admin/AdminSidebar"
import { SubCategoryList } from "@/components/admin/SubCategoryList"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from 'lucide-react'

interface CategoryPageProps {
  params: {
    categoryId: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategoryById(params.categoryId)

  if (!category) {
    notFound()
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Link href="/admin/categories">
                <Button variant="ghost" className="mb-2">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Categories
                </Button>
              </Link>
              <h1 className="text-2xl font-semibold">{category.name}</h1>
            </div>
            <div className="text-sm text-gray-500">
              Total Products: {category.totalProducts}
            </div>
          </div>
          <SubCategoryList initialCategory={category} />
        </div>
      </div>
    </div>
  )
}

