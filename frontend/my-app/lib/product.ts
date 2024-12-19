export interface Size {
  name: string;
  quantity: number;
}

export interface Color {
  name: string;
  sizes: Size[];
  imagePaths: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  subcategoryId: string;
  brand: string;
  sku: string;
  price: number;
  discountedPrice: number;
  tags: string[];
  colors: Color[];
}

const API_URL = process.env.API_URL;

export async function getProducts(page: number = 1, limit: number = 20, subcategoryId?: string): Promise<{ products: Product[], total: number }> {
  let url = `${API_URL}/products?page=${page}&limit=${limit}`;
  if (subcategoryId) {
    url += `&subcategoryId=${subcategoryId}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const data = await response.json();

  const mappedProducts: Product[] = data.products.map((item: any) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    categoryId: item.categoryId,
    subcategoryId: item.subcategoryId,
    brand: item.brand,
    sku: item.sku,
    price: item.price,
    discountedPrice: item.discountedPrice,
    tags: item.tags,
    colors: item.colors.map((color: any) => ({
      name: color.name,
      sizes: color.sizes,
      imagePaths: color.imagePaths.map((img: any) => img.path)
    }))
  }));

  return { products: mappedProducts, total: data.total };
}

export async function getProductById(id: string): Promise<Product | null> {
  const response = await fetch(`${API_URL}/products/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch product');
  }
  const item = await response.json();
  
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    categoryId: item.categoryId,
    subcategoryId: item.subcategoryId,
    brand: item.brand,
    sku: item.sku,
    price: item.price,
    discountedPrice: item.discountedPrice,
    tags: item.tags,
    colors: item.colors.map((color: any) => ({
      name: color.name,
      sizes: color.sizes,
      imagePaths: color.imagePaths.map((img: any) => img.path)
    }))
  };
}
