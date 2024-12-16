'use client'

import { useState, useEffect } from "react"
import { Category, SubCategory, createSubCategory, getCategories, deleteSubCategory, updateSubCategory } from "@/lib/categories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface SubCategoryListProps {
  initialCategory: Category
}

export function SubCategoryList({ initialCategory }: SubCategoryListProps) {
  const [category, setCategory] = useState<Category>(initialCategory)
  const [newSubCategoryName, setNewSubCategoryName] = useState("")
  const router = useRouter()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null)
  const [editName, setEditName] = useState("")

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
          parentId: category.id,
          itemCount: 0,
          image: '/placeholder.svg'
        })
        setNewSubCategoryName("")
        toast({
          title: "Success",
          description: "Subcategory added successfully",
        })
        setCategory(prevCategory => ({
          ...prevCategory,
          subCategories: [...prevCategory.subCategories, newSubCategory]
        }))
      } catch (error) {
        console.error("Error adding subcategory:", error)
        toast({
          title: "Error",
          description: "Failed to add subcategory",
          variant: "destructive",
        })
      }
    }
  }

  const handleEditSubCategory = (subCategory: SubCategory) => {
    setEditingSubCategory(subCategory)
    setEditName(subCategory.name)
    setIsEditDialogOpen(true)
  }

  const handleUpdateSubCategory = async () => {
    if (editingSubCategory && editName.trim()) {
      try {
        const updatedSubCategory = await updateSubCategory(editingSubCategory.id, { name: editName })
        toast({
          title: "Success",
          description: "Subcategory updated successfully",
        })
        setIsEditDialogOpen(false)
        setCategory(prevCategory => ({
          ...prevCategory,
          subCategories: prevCategory.subCategories.map(sc => 
            sc.id === updatedSubCategory.id ? updatedSubCategory : sc
          )
        }))
      } catch (error) {
        console.error("Error updating subcategory:", error)
        toast({
          title: "Error",
          description: "Failed to update subcategory",
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteSubCategory = async (subCategoryId: string) => {
    if (confirm('Are you sure you want to delete this subcategory?')) {
      try {
        await deleteSubCategory(subCategoryId)
        toast({
          title: "Success",
          description: "Subcategory deleted successfully",
        })
        setCategory(prevCategory => ({
          ...prevCategory,
          subCategories: prevCategory.subCategories.filter(sc => sc.id !== subCategoryId)
        }))
      } catch (error) {
        console.error("Error deleting subcategory:", error)
        toast({
          title: "Error",
          description: "Failed to delete subcategory",
          variant: "destructive",
        })
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

      {category.subCategories.length === 0 ? (
        <Card className="text-center p-6">
          <CardContent>
            <p className="text-lg mb-4">This category doesn't have any subcategories yet.</p>
            <Button onClick={() => setNewSubCategoryName('')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Subcategory
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.subCategories.map((subCategory) => (
            <Link href={`/admin/categories/${category.id}/${subCategory.id}`} key={subCategory.id}>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle>{subCategory.name}</CardTitle>
                  <div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleEditSubCategory(subCategory);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteSubCategory(subCategory.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{subCategory.itemCount} items</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subcategory</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleUpdateSubCategory}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

