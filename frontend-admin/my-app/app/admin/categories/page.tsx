import { getCategories } from "@/lib/categories"
import { CategoryGrid } from "@/components/admin/CategoryGrid"
import AdminSidebar from "@/components/admin/AdminSidebar"

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1">
        <div className="p-8">
          <CategoryGrid initialCategories={categories} />
        </div>
      </div>
    </div>
  )
}

