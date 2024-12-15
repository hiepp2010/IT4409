'use client'

import { useState } from "react"
import { Category } from "@/lib/categories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { createCategory, updateCategory } from "@/lib/categories"

interface CategoryDialogProps {
  category: Category | null
  isCreating: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  onCategoryCreated?: () => void
}

export function CategoryDialog({
  category,
  isCreating,
  open,
  onOpenChange,
  onCategoryCreated
}: CategoryDialogProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState(category?.name || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isCreating) {
        await createCategory({ name });
        if (onCategoryCreated) {
          onCategoryCreated();
        }
      } else if (category) {
        await updateCategory(category.id, { name });
      }

      router.refresh()
      onOpenChange(false)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isCreating ? "Add Category" : "Edit Category"}
          </DialogTitle>
          <DialogDescription>
            {isCreating
              ? "Add a new category to your store"
              : "Make changes to your category here"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isCreating ? "Create" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

