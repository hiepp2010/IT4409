export interface SubCategory {
  id: string;
  name: string;
  parentId: string;
  image: string;
  itemCount: number;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  subCategories: SubCategory[];
  totalProducts: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ;

export async function getCategories(): Promise<Category[]> {
  console.log(`${API_URL}/categories`)
  const response = await fetch(`${API_URL}/categories`);
  console.log(response)
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const response = await fetch(`${API_URL}/categories/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch category');
  }
  return response.json();
}

export async function createCategory(data: Omit<Category, 'id' | 'subCategories' | 'totalProducts'>): Promise<Category> {
  const response = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create category');
  }
  return response.json();
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<Category> {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update category');
  }
  return response.json();
}

export async function deleteCategory(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete category');
  }
}

export async function createSubCategory(categoryId: string, data: Omit<SubCategory, 'id'>): Promise<SubCategory> {
  const response = await fetch(`${API_URL}/subcategories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...data, categoryId }),
  });
  if (!response.ok) {
    throw new Error('Failed to create subcategory');
  }
  return response.json();
}

export async function updateSubCategory(id: string, data: Partial<SubCategory>): Promise<SubCategory> {
  const response = await fetch(`${API_URL}/subcategories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update subcategory');
  }
  return response.json();
}

export async function deleteSubCategory(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/subcategories/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete subcategory');
  }
}

