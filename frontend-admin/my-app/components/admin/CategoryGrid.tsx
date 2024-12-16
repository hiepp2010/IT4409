'use client'

import { useState, useEffect } from "react"
import { Category, getCategories, deleteCategory } from "@/lib/categories"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { CategoryDialog } from "./CategoryDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from 'next/navigation'
import { toast } from "@/hooks/use-toast"

interface CategoryGridProps {
  initialCategories: Category[]
}

export function CategoryGrid({ initialCategories }: CategoryGridProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/admin/categories/${categoryId}`);
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setIsCreating(false)
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setSelectedCategory(null)
    setIsCreating(true)
    setIsDialogOpen(true)
  }

  const fetchCategories = async () => {
    try {
      const updatedCategories = await getCategories()
      setCategories(updatedCategories)
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleCategoryCreated = () => {
    fetchCategories()
  }

  const handleDelete = async (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(categoryId)
        toast({
          title: "Success",
          description: "Category deleted successfully",
        })
        fetchCategories()
      } catch (error) {
        console.error("Error deleting category:", error)
        toast({
          title: "Error",
          description: "Failed to delete category",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardHeader 
              className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer"
              onClick={() => handleCategoryClick(category.id)}
            >
              <CardTitle className="text-sm font-medium">
                {category.name}
              </CardTitle>
              <div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(category);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(category.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{category.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                Total Products
              </p>
              <div className="text-sm mt-2">
                {category.subCategories.length} Subcategories
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={selectedCategory}
        isCreating={isCreating}
        onCategoryCreated={handleCategoryCreated}
      />
    </div>
  )
}

