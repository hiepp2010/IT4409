import { getCategories } from "@/lib/categories"
import AdminSidebar from "@/components/admin/AdminSidebar"
import { SubCategoryList } from "@/components/admin/SubCategoryList"
import { notFound } from "next/navigation"

interface SubCategoryPageProps {
  params: {
    categoryId: string
  }
}

export default async function SubCategoryPage({ params }: SubCategoryPageProps) {
  const categories = await getCategories()
  const category = categories.find(c => c.id === params.categoryId)

  if (!category) {
    notFound()
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1">
        <div className="p-8">
          <h1 className="text-2xl font-semibold mb-6">{category.name} Subcategories</h1>
          <SubCategoryList initialCategory={category} />
        </div>
      </div>
    </div>
  )
}

