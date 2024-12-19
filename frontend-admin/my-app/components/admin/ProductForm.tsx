'use client'

import { useState, useEffect } from "react"
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
import { Product, Color, Size, createProduct, updateProduct, deleteProduct } from "@/lib/products"
import { SubCategory, getCategories } from "@/lib/categories"
import { toast } from "@/hooks/use-toast"

// Add this function after the imports
function convertGoogleDriveUrl(url: string): string {
  const fileId = url.match(/\/d\/(.+?)\/view/)?.[1]
  if (fileId) {
    return `https://drive.google.com/uc?export=view&id=${fileId}`
  }
  return url
}

interface ProductFormProps {
  initialData: Product | null
  isNewProduct: boolean
}

const emptyProduct: Product = {
  id: "",
  name: "",
  description: "",
  subcategoryId: "",
  brand: "",
  sku: "",
  price: 0,
  discountedPrice: 0,
  colors: [],
  categoryId: "",
}

const API_URL=process.env.API_URL;

export default function ProductForm({ initialData, isNewProduct }: ProductFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Product>(initialData || emptyProduct)
  const [newColorName, setNewColorName] = useState("")
  const [newSizeName, setNewSizeName] = useState("")
  const [newImageUrls, setNewImageUrls] = useState<{[key: number]: string}>({})
  const [isLoading, setIsLoading] = useState(false)
  const [subcategories, setSubcategories] = useState<SubCategory[]>([])
  const [subcategoryName, setSubcategoryName] = useState(""); // Added state for subcategory name

  useEffect(() => {
    console.log("Updated formData:", formData);
  }, [formData]);

  useEffect(() => {
    fetchSubcategories()
  }, [])

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        colors: initialData.colors || []
      })
      // Set the initial subcategory name
      const initialSubcategory = subcategories.find(sc => sc.id === initialData.subcategoryId)
      if (initialSubcategory) {
        setSubcategoryName(initialSubcategory.name)
      }
    }
  }, [initialData, subcategories]) // Updated dependencies

  const fetchSubcategories = async () => {
    try {
      const response = await fetch(`${API_URL}/subcategories`);
      if (!response.ok) {
        throw new Error('Failed to fetch subcategories');
      }
      const fetchedSubcategories = await response.json();
      setSubcategories(fetchedSubcategories);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch subcategories",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubcategoryChange = (value: string) => {
    const selectedSubcategory = subcategories.find(sc => sc.id === value)
    if (selectedSubcategory) {
      setSubcategoryName(selectedSubcategory.name)
      setFormData(prev => ({
        ...prev,
        subcategoryId: value,
      }));
    }
  };


  const handleAddColor = () => {
    if (newColorName.trim()) {
      const newColor: Color = {
        name: newColorName.trim(),
        sizes: [],
        images: [],
        imagePaths: []
      }
      setFormData((prev) => ({
        ...prev,
        colors: [...(prev.colors || []), newColor]
      }))
      setNewColorName("")
    }
  }

  const handleAddSize = (colorIndex: number) => {
    if (newSizeName.trim()) {
      setFormData((prev) => ({
        ...prev,
        colors: (prev.colors || []).map((color, index) => {
          if (index === colorIndex) {
            return {
              ...color,
              sizes: [...(color.sizes || []), { name: newSizeName.trim(), quantity: 0 }]
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
      colors: (prev.colors || []).map((color, cIndex) => {
        if (cIndex === colorIndex) {
          return {
            ...color,
            sizes: (color.sizes || []).map((size, sIndex) =>
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
      colors: (prev.colors || []).filter((_, index) => index !== colorIndex)
    }))
  }

  const handleAddImage = (colorIndex: number) => {
    const imageUrl = newImageUrls[colorIndex]
    if (imageUrl && imageUrl.trim()) {
      const convertedUrl = convertGoogleDriveUrl(imageUrl.trim())
      setFormData((prev) => ({
        ...prev,
        colors: prev.colors.map((color, index) => {
          if (index === colorIndex) {
            return {
              ...color,
              imagePaths: [...(color.imagePaths || []), convertedUrl]
            }
          }
          return color
        })
      }))
      setNewImageUrls(prev => ({...prev, [colorIndex]: ''}))
    }
  }

  const removeImage = (colorIndex: number, imageToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: (prev.colors || []).map((color, index) => {
        if (index === colorIndex) {
          return {
            ...color,
            imagePaths: (color.imagePaths || []).filter((img) => img !== imageToRemove)
          }
        }
        return color
      })
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let savedProduct: Product
      if (isNewProduct) {
        const response = await fetch('http://localhost:3100/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
        if (!response.ok) {
          throw new Error('Failed to create product')
        }
        savedProduct = await response.json()
        toast({
          title: "Success",
          description: "Product created successfully",
        })
      } else {
        const response = await fetch(`${API_URL}/products/${formData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
        if (!response.ok) {
          throw new Error('Failed to update product')
        }
        savedProduct = await response.json()
        toast({
          title: "Success",
          description: "Product updated successfully",
        })
      }
      router.push('/admin/products')
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: isNewProduct ? "Failed to create product" : "Failed to update product",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }


  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this product?')) {
      setIsLoading(true)
      try {
        const response = await fetch(`${API_URL}/products/${formData.id}`, {
          method: 'DELETE',
        })
        if (!response.ok) {
          throw new Error('Failed to delete product')
        }
        toast({
          title: "Success",
          description: "Product deleted successfully",
        })
        router.push('/admin/products')
      } catch (error) {
        console.error("Error:", error)
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
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
              <Label htmlFor="subcategory">Subcategory</Label>
              <Select
                value={formData.subcategoryId}
                onValueChange={handleSubcategoryChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {subcategoryName || "Select subcategory"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((subCategory) => (
                    <SelectItem key={subCategory.id} value={subCategory.id}>
                      {subCategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                />
              </div>
              <div>
                <Label htmlFor="discountedPrice">Discounted Price</Label>
                <Input
                  id="discountedPrice"
                  name="discountedPrice"
                  type="number"
                  value={formData.discountedPrice}
                  onChange={handleInputChange}
                  placeholder="Enter discounted price"
                />
              </div>
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
                {(formData.colors || []).map((color, colorIndex) => (
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
                        {(color.sizes || []).map((size, sizeIndex) => (
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
                      <div className="flex gap-2 mt-2">
                        <Input
                          type="url"
                          value={newImageUrls[colorIndex] || ''}
                          onChange={(e) => setNewImageUrls(prev => ({...prev, [colorIndex]: e.target.value}))}
                          placeholder="Enter image URL or Google Drive link"
                        />
                        <Button type="button" onClick={() => handleAddImage(colorIndex)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        {(color.imagePaths || []).map((image, imageIndex) => (
                          <div key={imageIndex} className="relative">
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
          <Button type="submit" className="w-24" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add'}
          </Button>
        ) : (
          <>
            <Button type="submit" className="w-24" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="w-24"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </>
        )}
        <Button
          type="button"
          variant="outline"
          className="w-24"
          onClick={() => router.push('/admin/products')}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

