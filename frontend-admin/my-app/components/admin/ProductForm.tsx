'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Plus, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Product, Color, Size } from "@/lib/products"

interface ProductFormProps {
  initialData?: Product | null
  isNewProduct: boolean
}

const CATEGORIES = ["Sneaker", "T-Shirt", "Jeans", "Jacket", "Accessories"]

const emptyProduct: Product = {
  id: "",
  name: "",
  description: "",
  category: "",
  brand: "",
  sku: "",
  regularPrice: 0,
  salePrice: 0,
  tags: [],
  colors: [],
}

export default function ProductForm({ initialData, isNewProduct }: ProductFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Product>(initialData || emptyProduct)
  const [newTag, setNewTag] = useState("")
  const [newColorName, setNewColorName] = useState("")
  const [newSizeName, setNewSizeName] = useState("")

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault()
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove)
    }))
  }

  const handleAddColor = () => {
    if (newColorName.trim()) {
      const newColor: Color = {
        name: newColorName.trim(),
        sizes: [],
        images: []
      }
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, newColor]
      }))
      setNewColorName("")
    }
  }

  const handleAddSize = (colorIndex: number) => {
    if (newSizeName.trim()) {
      setFormData((prev) => ({
        ...prev,
        colors: prev.colors.map((color, index) => {
          if (index === colorIndex) {
            return {
              ...color,
              sizes: [...color.sizes, { name: newSizeName.trim(), quantity: 0 }]
            }
          }
          return color
        })
      }))
      setNewSizeName("")
    }
  }

  const handleSizeQuantityChange = (
    colorIndex: number,
    sizeIndex: number,
    quantity: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.map((color, cIndex) => {
        if (cIndex === colorIndex) {
          return {
            ...color,
            sizes: color.sizes.map((size, sIndex) =>
              sIndex === sizeIndex ? { ...size, quantity } : size
            )
          }
        }
        return color
      })
    }))
  }

  const removeColor = (colorIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, index) => index !== colorIndex)
    }))
  }

  const handleImageUpload = (colorIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    // In a real app, you would upload these files to a storage service
    // For now, we'll just create URLs for preview
    const newImages = files.map((file) => URL.createObjectURL(file))
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.map((color, index) => {
        if (index === colorIndex) {
          return {
            ...color,
            images: [...color.images, ...newImages]
          }
        }
        return color
      })
    }))
  }

  const removeImage = (colorIndex: number, imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.map((color, index) => {
        if (index === colorIndex) {
          return {
            ...color,
            images: color.images.filter((img) => img !== imageUrl)
          }
        }
        return color
      })
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send this to your API
    console.log(formData)
    router.push('/admin/products')
  }

  const handleDelete = () => {
    // In a real app, you would call an API to delete the product
    console.log("Delete product:", formData.id)
    router.push('/admin/products')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="brand">Brand Name</Label>
              <Input
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="Enter brand name"
              />
            </div>

            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="Enter SKU"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="regularPrice">Regular Price</Label>
                <Input
                  id="regularPrice"
                  name="regularPrice"
                  type="number"
                  value={formData.regularPrice}
                  onChange={handleInputChange}
                  placeholder="Enter regular price"
                />
              </div>
              <div>
                <Label htmlFor="salePrice">Sale Price</Label>
                <Input
                  id="salePrice"
                  name="salePrice"
                  type="number"
                  value={formData.salePrice}
                  onChange={handleInputChange}
                  placeholder="Enter sale price"
                />
              </div>
            </div>

            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-xs"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type and press Enter to add tags"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Label>Colors & Sizes</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  placeholder="Enter color name"
                />
                <Button type="button" onClick={handleAddColor}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4 mt-4">
                {formData.colors.map((color, colorIndex) => (
                  <Card key={colorIndex} className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">{color.name}</h4>
                      <button
                        type="button"
                        onClick={() => removeColor(colorIndex)}
                        className="text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={newSizeName}
                          onChange={(e) => setNewSizeName(e.target.value)}
                          placeholder="Enter size name"
                        />
                        <Button type="button" onClick={() => handleAddSize(colorIndex)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {color.sizes.map((size, sizeIndex) => (
                          <div
                            key={sizeIndex}
                            className="flex items-center gap-2"
                          >
                            <span className="w-12">{size.name}</span>
                            <Input
                              type="number"
                              value={size.quantity}
                              onChange={(e) =>
                                handleSizeQuantityChange(
                                  colorIndex,
                                  sizeIndex,
                                  parseInt(e.target.value)
                                )
                              }
                              placeholder="Quantity"
                              className="w-24"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label>Color Images</Label>
                      <div className="mt-2 border-2 border-dashed rounded-lg p-6 text-center">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleImageUpload(colorIndex, e)}
                          className="hidden"
                          id={`image-upload-${colorIndex}`}
                        />
                        <label
                          htmlFor={`image-upload-${colorIndex}`}
                          className="cursor-pointer text-blue-600 hover:text-blue-700"
                        >
                          Drop your images here, or browse
                        </label>
                        <p className="text-sm text-gray-500 mt-1">
                          jpeg, png are allowed
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        {color.images.map((image, imageIndex) => (
                          <div key={imageIndex} className="relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={image}
                              alt={`Color ${color.name} - Image ${imageIndex + 1}`}
                              className="w-full h-32 object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(colorIndex, image)}
                              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-4">
        {isNewProduct ? (
          <Button type="submit" className="w-24">
            Add
          </Button>
        ) : (
          <>
            <Button type="submit" className="w-24">
              Edit
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="w-24"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </>
        )}
        <Button
          type="button"
          variant="outline"
          className="w-24"
          onClick={() => router.push('/admin/products')}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

