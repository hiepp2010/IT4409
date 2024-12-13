export interface Size {
  name: string;
  quantity: number;
}

export interface Color {
  name: string;
  sizes: Size[];
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  sku: string;
  regularPrice: number;
  salePrice: number;
  tags: string[];
  colors: Color[];
}

const generateRandomColor = (): Color => {
  const colorNames = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  return {
    name: colorNames[Math.floor(Math.random() * colorNames.length)],
    sizes: sizes.map(size => ({ name: size, quantity: Math.floor(Math.random() * 50) + 10 })),
    images: ['/placeholder.svg']
  };
};

export const products: Product[] = Array.from({ length: 20 }, (_, i) => ({
  id: `PRD${String(i + 1).padStart(5, '0')}`,
  name: `Product ${i + 1}`,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  category: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'][Math.floor(Math.random() * 5)],
  brand: ['Nike', 'Adidas', 'Apple', 'Samsung', 'Sony'][Math.floor(Math.random() * 5)],
  sku: `SKU${String(i + 1).padStart(5, '0')}`,
  regularPrice: Math.floor(Math.random() * 900) + 100,
  salePrice: Math.floor(Math.random() * 800) + 50,
  tags: ['tag1', 'tag2', 'tag3'].slice(0, Math.floor(Math.random() * 3) + 1),
  colors: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, generateRandomColor),
}));

export async function getProducts(page: number = 1, limit: number = 9): Promise<{ products: Product[], total: number }> {
  // In a real application, this would be an API call with pagination
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedProducts = products.slice(start, end);
  return {
    products: paginatedProducts,
    total: products.length
  };
}

export async function getProductById(id: string): Promise<Product | null> {
  // In a real application, this would be an API call
  const product = products.find(p => p.id === id);
  return product || null;
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  // In a real application, this would be an API call to create a new product
  const newProduct: Product = {
    ...product,
    id: `PRD${String(products.length + 1).padStart(5, '0')}`,
  };
  products.push(newProduct);
  return newProduct;
}

export async function updateProduct(product: Product): Promise<Product> {
  // In a real application, this would be an API call to update an existing product
  const index = products.findIndex(p => p.id === product.id);
  if (index !== -1) {
    products[index] = product;
    return product;
  }
  throw new Error('Product not found');
}

export async function deleteProduct(id: string): Promise<void> {
  // In a real application, this would be an API call to delete a product
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products.splice(index, 1);
  } else {
    throw new Error('Product not found');
  }
}

