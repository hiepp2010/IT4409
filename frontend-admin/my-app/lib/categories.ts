export interface SubCategory {
    id: string;
    name: string;
    parentId: string;
    image: string;
    itemCount: number;
  }
  
  export interface Category {
    id: string;
    name: string;
    subCategories: SubCategory[];
    totalProducts: number;
  }
  
  // Sample data
  export const categories: Category[] = [
    {
      id: '1',
      name: 'Men Clothes',
      subCategories: [
        { id: '1-1', name: 'Shirts', parentId: '1', itemCount: 10, image: '/placeholder.svg' },
        { id: '1-2', name: 'Pants', parentId: '1', itemCount: 8, image: '/placeholder.svg' },
      ],
      totalProducts: 18
    },
    {
      id: '2',
      name: 'Women Clothes',
      subCategories: [
        { id: '2-1', name: 'Dresses', parentId: '2', itemCount: 15, image: '/placeholder.svg' },
        { id: '2-2', name: 'Skirts', parentId: '2', itemCount: 10, image: '/placeholder.svg' },
      ],
      totalProducts: 25
    },
    {
      id: '3',
      name: 'Accessories',
      subCategories: [
        { id: '3-1', name: 'Hats', parentId: '3', itemCount: 8, image: '/placeholder.svg' },
        { id: '3-2', name: 'Scarves', parentId: '3', itemCount: 7, image: '/placeholder.svg' },
      ],
      totalProducts: 15
    },
  ];
  
  export async function getCategories(): Promise<Category[]> {
    // In a real app, this would be an API call
    return categories;
  }
  
  export async function updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    
    categories[index] = { ...categories[index], ...data };
    return categories[index];
  }
  
  export async function createCategory(data: Omit<Category, 'id' | 'subCategories' | 'totalProducts'>): Promise<Category> {
    const newCategory: Category = {
      id: String(categories.length + 1),
      ...data,
      subCategories: [],
      totalProducts: 0
    };
    categories.push(newCategory);
    return newCategory;
  }
  
  export async function createSubCategory(categoryId: string, data: Omit<SubCategory, 'id' | 'parentId'>): Promise<SubCategory> {
    const category = categories.find(c => c.id === categoryId);
    if (!category) throw new Error('Category not found');
  
    const newSubCategory: SubCategory = {
      id: `${categoryId}-${category.subCategories.length + 1}`,
      parentId: categoryId,
      ...data,
      image: '/placeholder.svg'  // You may want to update this to allow image uploads
    };
  
    category.subCategories.push(newSubCategory);
    category.totalProducts += data.itemCount;
    return newSubCategory;
  }
  
  export async function addCategory(newCategory: Omit<Category, 'id'>): Promise<Category> {
    const category: Category = {
      ...newCategory,
      id: String(categories.length + 1),
      subCategories: [],
      totalProducts: 0
    };
    categories.push(category);
    return category;
  }
  
  export async function addProductToCategory(categoryId: string, productName: string): Promise<void> {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      category.totalProducts += 1;
    } else {
      throw new Error('Category not found');
    }
  }
  
  export async function updateCategoryTotalProducts(categoryId: string, change: number): Promise<void> {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      category.totalProducts += change;
    } else {
      throw new Error('Category not found');
    }
  }
  
  