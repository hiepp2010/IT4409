'use client'

import { useState, useEffect } from "react"
import { Category, SubCategory, createSubCategory, getCategories } from "@/lib/categories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface SubCategoryListProps {
  initialCategory: Category
}

export function SubCategoryList({ initialCategory }: SubCategoryListProps) {
  const [category, setCategory] = useState<Category>(initialCategory)
  const [newSubCategoryName, setNewSubCategoryName] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchLatestData = async () => {
      const categories = await getCategories()
      const updatedCategory = categories.find(c => c.id === initialCategory.id)
      if (updatedCategory) {
        setCategory(updatedCategory)
      }
    }
    fetchLatestData()
  }, [initialCategory.id])

  const handleAddSubCategory = async () => {
    if (newSubCategoryName.trim()) {
      try {
        const newSubCategory = await createSubCategory(category.id, {
          name: newSubCategoryName,
          itemCount: 0,
          image: '/placeholder.svg'
        })
        setCategory(prevCategory => ({
          ...prevCategory,
          subCategories: [...prevCategory.subCategories, newSubCategory]
        }))
        setNewSubCategoryName("")
        router.refresh()
      } catch (error) {
        console.error("Error adding subcategory:", error)
      }
    }
  }

  return (
    <div>
      <div className="flex items-center space-x-2 mb-6">
        <Input
          placeholder="New subcategory name"
          value={newSubCategoryName}
          onChange={(e) => setNewSubCategoryName(e.target.value)}
        />
        <Button onClick={handleAddSubCategory}>
          <Plus className="h-4 w-4 mr-2" />
          Add Subcategory
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.subCategories.map((subCategory) => (
          <Link href={`/admin/categories/${category.id}/${subCategory.id}`} key={subCategory.id}>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{subCategory.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{subCategory.itemCount} items</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

